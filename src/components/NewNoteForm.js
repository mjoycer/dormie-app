import axios from "axios";
import { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

const NewNoteForm = () => {
    const [newNote, setNewNote] = useState();
    const currentUser = useSelector(state => state.loggedInUser);
    const dispatch = useDispatch();

    const handleInput = (e) => {
        setNewNote(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        e.target.reset();

        axios.post('https://mjoycer-dormie-backend.herokuapp.com/notes', { author: currentUser.id, message: newNote }, { headers: { Authorization: `Bearer ${currentUser.token}` } }).then(res => {
            axios.get('https://mjoycer-dormie-backend.herokuapp.com/notes', { headers: { Authorization: `Bearer ${currentUser.token}` } }).then(res => {
                dispatch({ type: 'SET_NOTES', payload: res.data });
            })
        }
        );
    }

    return (
        <Container className="newNoteFormContainer">
            <form className="d-flex flex-column gap-2 mx-auto" onSubmit={handleSubmit}>
                <textarea placeholder="Write your message here..." onChange={(e) => handleInput(e)} />
                <Button type="submit"> Post </Button>
            </form>
        </Container>
    )

}

export default NewNoteForm;
