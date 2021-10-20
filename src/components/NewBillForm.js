import axios from "axios";
import { useEffect, useState } from "react";
import { Badge, Container, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

const NewBillForm = () => {
    const users = useSelector(state => state.users);
    const [taggedUsers, setTaggedUsers] = useState([]);
    const [allUsers, setAllUsers] = useState(users);
    const [newBill, setNewBill] = useState([]);
    const [isNecessity, setIsNecessity] = useState();
    const currentUser = useSelector(state => state.loggedInUser);
    const dispatch = useDispatch();

    useEffect(() => {
        setAllUsers(users);
    }, [users]);

    useEffect(() => {
        if (isNecessity) {
            setTaggedUsers(users.map(user => user._id))
        } else {
            setTaggedUsers([]);
        }
    }, [isNecessity])



    const handleInput = (e) => {
        let name = e.target.name;

        setNewBill({ ...newBill, [name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        e.target.reset();
        setTaggedUsers([]);
        setAllUsers(users);

        axios.post('https://mjoycer-dormie-backend.herokuapp.com/bills',
            {
                name: newBill.name,
                amount: newBill.amount,
                dueDate: newBill.deadline,
                isNecessity: isNecessity,
                unpaidUsers: taggedUsers
            }, { headers: { Authorization: `Bearer ${currentUser.token}` } }).then(res => {
                axios.get('https://mjoycer-dormie-backend.herokuapp.com/bills', { headers: { Authorization: `Bearer ${currentUser.token}` } }).then(res => {
                    console.log(res.data);
                    dispatch({ type: 'SET_BILLS', payload: res.data });
                });
            });
    }

    const addUser = (e) => {
        setTaggedUsers([...taggedUsers, e.target.value]);
        setAllUsers(allUsers.filter(user => user._id !== e.target.value));
    }

    const removeUser = (e) => {
        setTaggedUsers(taggedUsers.filter(user => user !== e.target.value));
        let removedUser = users.find(user => user._id === e.target.value);
        setAllUsers([removedUser, ...allUsers]);
    }

    const checkboxHandler = (e) => {
        setIsNecessity(e.target.checked);
    }

    return (
        <Container className="newNoteFormContainer">
            <form className="d-flex flex-column flex-wrap" onSubmit={handleSubmit}>
                Bill: <input required type="text" name="name" onChange={(e) => { handleInput(e) }} />
                Amount: <input required type="number" name="amount" onChange={(e) => { handleInput(e) }} />
                Due Date: <input required type="date" name="deadline" onChange={(e) => { handleInput(e) }} />
                <label htmlFor="isNecessity">Necessity?</label>
                <input type="checkbox" name="isNecessity" onChange={(e) => checkboxHandler(e)} />
                {(!isNecessity) && <div>
                    Users:
                    {users.map(user =>
                        taggedUsers.includes(user._id) &&
                        <Badge>{user.name}
                            <Button className="btn-danger" type="button" value={user._id} onClick={(e) => removeUser(e)}>x</Button>
                        </Badge>)
                    }
                    {allUsers.map(user => {
                        return (

                            <Badge>{user.name}
                                <Button className="mx-1" variant="outline-primary" type="button" value={user._id} onClick={(e) => addUser(e)}> +</Button>
                            </Badge>

                        )
                    })}
                </div>}
                <input type="submit" value="Add Bill" />
            </form>
        </Container>
    )
}

export default NewBillForm;
