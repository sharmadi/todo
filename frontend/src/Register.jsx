import { useState } from "react"
import './styles/Register.css'
import { addUser } from "./api/register"
import { useNavigate } from 'react-router-dom';


const Register = () => {

    const navigate = useNavigate();

    const [draftUser, setDraftUser] = useState({
        email: '',
        password: '',
        userId: null,
    });

    const login = () => {
        navigate("/login");
    }

    const handleChange = (e) => {
        setDraftUser({...draftUser, [e.target.name]: e.target.value});
    } 

    return(
        <div class = "container">
            <h3 id = "signUpHeader">Sign Up</h3>
            <div class="form-outline mb-4">
                <label for="exampleInputEmail1">Enter Email: </label>
                <input type="email" id="email" name = "email" class="form-control" value = {draftUser.email} onChange={handleChange} />
            </div>
            <div class="form-outline mb-4">
                <label for="exampleInputPassword1">Enter Password: </label>
                <input type="password" id="password" name = "password" class="form-control" value = {draftUser.password} onChange={handleChange} />
            </div>
            <div>
                <button class="btn btn-success" id="btnsubmitLogin" onClick={() => addUser({ draftUser })} value="Submit">Sign Up</button>
                <br></br>
                <button class="btn btn-success" id="btnsubmitSignUp" onClick={() => login()} value="Submit">Sign In</button>
            </div>
        </div>
    )
}
export default Register; 