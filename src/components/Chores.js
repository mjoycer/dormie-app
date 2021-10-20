import axios from "axios";
import { Button, Card, Badge, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const Chores = () => {
    const chores = useSelector(state => state.chores);
    const users = useSelector(state => state.users);
    const currentUser = useSelector(state => state.loggedInUser);
    const dispatch = useDispatch();

    useEffect(() => {
        axios.get('https://mjoycer-dormie-backend.herokuapp.com/users', { headers: { Authorization: `Bearer ${currentUser.token}` } }).then(res => {
            dispatch({ type: 'SET_USERS', payload: res.data });
        });

        axios.get('https://mjoycer-dormie-backend.herokuapp.com/chores', { headers: { Authorization: `Bearer ${currentUser.token}` } }).then(res => {
            dispatch({ type: 'SET_CHORES', payload: res.data });
        });

    }, []);

    const pendingToDone = (e) => {
        axios.put(`https://mjoycer-dormie-backend.herokuapp.com/chores/${e.target.value}`, { status: 'Done' }, { headers: { Authorization: `Bearer ${currentUser.token}` } }).then(res => {
            axios.get('https://mjoycer-dormie-backend.herokuapp.com/chores', { headers: { Authorization: `Bearer ${currentUser.token}` } }).then(res => {
                dispatch({ type: 'SET_CHORES', payload: res.data });
            });
        });
    }

    return (
        <Container>
            <div className="sectionHeader">
                <h3>CHORES</h3>
            </div>
            <div className="choresContainer d-flex flex-nowrap">
                {chores.length > 0 ?
                    chores.map(chore => {
                        let taggedUsers = users.filter(user => (chore.users.includes(user._id)));
                        return (
                            <Card className="m-2 choreCard" bg="info" style={{ width: '12rem' }}>
                                <Card.Body>
                                    <Card.Title>{chore.name}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">Due: {new Date(chore.deadline).toLocaleString()}</Card.Subtitle>
                                    <div className="d-flex flex-wrap justify-content-center">
                                        {taggedUsers.map(user => <Badge pill className="m-1" >{user.name}</Badge>)}
                                    </div>
                                    {chore.status === 'Pending' ?
                                        <Button
                                            variant="outline-success"
                                            className="checkIcon"
                                            value={chore._id}
                                            onClick={(e) => pendingToDone(e)}>
                                            Done
                                        </Button>
                                        : null}
                                </Card.Body>
                            </Card>
                        );
                    }) : <p>No chores to display</p>
                }
            </div>
            {/* </div> */}
        </Container>
    );
}

export default Chores;
