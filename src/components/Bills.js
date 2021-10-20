import { useSelector, useDispatch } from "react-redux";
import { Button, Card, Container, Badge } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useEffect } from "react";

const Bills = () => {
    const currentUser = useSelector(state => state.loggedInUser);
    const bills = useSelector(state => state.bills);
    const users = useSelector(state => state.users);
    const dispatch = useDispatch();

    useEffect(() => {
        axios.get('https://mjoycer-dormie-backend.herokuapp.com/users', { headers: { Authorization: `Bearer ${currentUser.token}` } }).then(res => {
            dispatch({ type: 'SET_USERS', payload: res.data });
        });

        axios.get(`https://mjoycer-dormie-backend.herokuapp.com/bills/`, { headers: { Authorization: `Bearer ${currentUser.token}` } }).then(res => {
            dispatch({ type: 'SET_BILLS', payload: res.data });
            console.log(res.data);
        });

    }, []);


    const paidButtonHandler = (e) => {
        let currentBill = bills.find(bill => bill._id === e.target.value)
        let removePaidUser = currentBill.unpaidUsers.filter(user => user !== currentUser.id);
        let updatedPaidUsers = [...currentBill.paidUsers, currentUser.id]

        axios.put(`https://mjoycer-dormie-backend.herokuapp.com/bills/${e.target.value}`,
            {
                unpaidUsers: removePaidUser,
                paidUsers: updatedPaidUsers
            },
            { headers: { Authorization: `Bearer ${currentUser.token}` } }).then(res => {
                axios.get('https://mjoycer-dormie-backend.herokuapp.com/bills',
                    { headers: { Authorization: `Bearer ${currentUser.token}` } }).then(res => {
                        dispatch({ type: 'SET_BILLS', payload: res.data });
                    });
            });
    }

    return (
        <Container>
            <div className="sectionHeader">
                <h2>BILLS</h2>
            </div>
            <div className="choresContainer d-flex flex-nowrap">
                {bills.length > 0 ?
                    bills.map(bill => {
                        let taggedUsers = users.filter(user => (bill.unpaidUsers.includes(user._id)) || (bill.paidUsers.includes(user._id)));
                        return (
                            <Card className="m-2 choreCard" bg="info" style={{ width: '12rem' }}>
                                <Card.Body>
                                    <Card.Title>{bill.name}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">Due: {new Date(bill.dueDate).toLocaleDateString()}</Card.Subtitle>
                                    <Card.Text>
                                        Php{bill.amount}
                                    </Card.Text>
                                    <div className="d-flex flex-wrap justify-content-center">
                                        {taggedUsers.map(user => <Badge pill className="m-1" >{user.name}</Badge>)}
                                    </div>
                                    {bill.unpaidUsers.includes(currentUser.id) ? <Button variant="outline-success" className="checkIcon" key={uuidv4()} value={bill._id} onClick={e => paidButtonHandler(e)}>Paid</Button> : null}
                                </Card.Body>
                            </Card>
                        )
                    }) : <p>No bills to display. Hurray!</p>
                }
            </div>
        </Container>
    );
}

export default Bills;
