import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Badge, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

const NewChoreForm = () => {
    const users = useSelector(state => state.users);
    const currentUser = useSelector(state => state.loggedInUser);
    const [taggedUsers, setTaggedUsers] = useState([]);
    const [allUsers, setAllUsers] = useState(users);
    const [newChore, setNewChore] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        setAllUsers(users);
    }, [users]);

    const handleInput = (e) => {
        let name = e.target.name;
        setNewChore({ ...newChore, [name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        e.target.reset();
        setTaggedUsers([]);
        setAllUsers(users);

        axios.post('https://mjoycer-dormie-backend.herokuapp.com/chores',
            {
                name: newChore.name,
                deadline: newChore.deadline,
                users: taggedUsers
            }, { headers: { Authorization: `Bearer ${currentUser.token}` } }).then(res => {
                axios.get('https://mjoycer-dormie-backend.herokuapp.com/chores', { headers: { Authorization: `Bearer ${currentUser.token}` } }).then(res => {
                    console.log(res.data);
                    dispatch({ type: 'SET_CHORES', payload: res.data });
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

    return (
        <Container className="newNoteFormContainer">
            <form className="d-flex flex-column flex-wrap" onSubmit={handleSubmit}>
                Chore: <input required type="text" name="name" onChange={(e) => { handleInput(e) }} />
                Deadline: <input required type="date" name="deadline" onChange={(e) => { handleInput(e) }} />
                Users:
                <div>
                    {users.map(user =>
                        taggedUsers.includes(user._id) &&
                        <Badge>{user.name}
                            <Button className="btn-danger" type="button" value={user._id} onClick={(e) => removeUser(e)}>x</Button>
                        </Badge>)
                    }
                </div>
                <div className="d-flex flex-row flex-wrap">
                    {allUsers.map(user => {
                        return (
                            <Badge className="m-1 addUserBadge">{user.name}
                                <Button className="mx-1" variant="outline-primary" type="button" value={user._id} onClick={(e) => addUser(e)}> +</Button>
                            </Badge>
                        )
                    })}
                </div>
                <Button className="newNoteFormContainer align-self-center" type="submit">Add Chore</Button>
            </form>
        </Container>
    )
}

export default NewChoreForm;
