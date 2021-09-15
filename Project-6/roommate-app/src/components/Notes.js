import axios from "axios";
import { useState } from "react";
import { Button, Modal, Row, Col, Card, Container} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

const Notes = () => {
    const notes = useSelector(state => state.notes);
    const users = useSelector(state => state.users);
    const currentUser = useSelector(state => state.loggedInUser);
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();

    const removeNote = (e) => {
        axios.delete(`http://localhost:8000/notes/${e.target.value}`, { headers: { Authorization: `Bearer ${currentUser.token}` } }).then(res => {
            axios.get('http://localhost:8000/notes', { headers: { Authorization: `Bearer ${currentUser.token}` } }).then(res => {
                dispatch({ type: 'SET_NOTES', payload: res.data });
                console.log(res.data);
            });
        });
    }


    console.log(currentUser.id);

    return (
        <Container>
            <div>
                <div className="sectionHeader" >
                    <h3> NOTES </h3>
                </div>
                <div className="my-3 d-flex flex-wrap">
                    {(notes.length > 0) ?
                        notes.map(note => {
                            let author = users.find(user => user._id === note.author);
                            let current = users.find(user => user._id === currentUser.id);
                            console.log(current);
                            console.log(author._id);
                            return (
                                <Card className="m-2" bg="info" >
                                    <Card.Body>
                                        <Card.Title>{author.name}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{new Date(note.createdAt).toLocaleString()}</Card.Subtitle>
                                        <Card.Text>{note.message}</Card.Text>
                                    {current._id === author._id || current.role === "leader" ?
                                        <div className="text-center">
                                                <Button variant="outline-danger" value={note._id} onClick={(e) => removeNote(e)}>Remove</Button>
                                            {/* <div className="col">
                                                <Button value={note._id} >Edit</Button>
                                            </div> */}
                                        </div>
                                        : null
                                    }
                                    </Card.Body>
                                </Card>
                            );
                        }) : <p>No notes to display</p>
                    }
                </div>
            </div>

        </Container>

    );
}
export default Notes;