import { useState } from "react";
import axios from 'axios';
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";

const RegistrationForm = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [newUser, setNewUser] = useState();

    const handleInput = (e) => {
        const name = e.target.name;
        setNewUser({ ...newUser, [name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('https://mjoycer-dormie-backend.herokuapp.com/users/email-exists', { email: newUser.email }).then(res => {
            console.log(res.data);

            (!res.data) ?
                axios.post('https://mjoycer-dormie-backend.herokuapp.com/users/register', newUser).then(res => {
                    axios.post('https://mjoycer-dormie-backend.herokuapp.com/users/login', { email: newUser.email, password: newUser.password }).then(res => {
                        dispatch({ type: 'LOGIN', payload: res.data.auth });
                        console.log(res.data);
                        history.push('/home');
                    })
                }) :
                console.log('Invalid');
        });

    }

    return (
        <div className="landingPage d-flex flex-column align-items-center justify-content-center flex-wrap center">
            <div className="brand mb-3">
                <h1>DORMIE</h1>
                <p>roommate app</p>
            </div>
            <form className="d-grid gap-3" onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        name="name"
                        required
                        placeholder="Name"
                        onChange={(e) => handleInput(e)} />
                </div>

                <div>
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="Email"
                        onChange={(e) => handleInput(e)} />
                </div>

                <div>
                    <input
                        type="password"
                        name="password"
                        required
                        placeholder="Password"
                        onChange={(e) => handleInput(e)} />
                </div>

                <Button type="submit">Register</Button>
                <Button type="button" variant="light"><Link to="/">Back to Login</Link></Button>
            </form>

        </div>
    );
}

export default RegistrationForm;
