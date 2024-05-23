import { useEffect, useState } from "react";
import './styles/Login.css'
import { useNavigate } from "react-router-dom";
import { Auth } from "./api/auth";

const Login = () => {

    const { login } = Auth();

    const navigate = useNavigate(); 

    const [draftLogin, setDraftLogin] = useState({
        email: '',
        password: ''
    })

    const [isErrorMessage, setIsErrorMessage] = useState(false);

    const signUp = () => {
        navigate("/register");
    }

    const handleChange = (e) => {
        setDraftLogin({...draftLogin, [e.target.name]: e.target.value});
    }

    return (
        <>
        <div class = "container" id = "loginBody">
            <h3 id = "loginHeader">Login</h3>
            { isErrorMessage && (
            <div class = "errorMessage">
                <p>Incorrect Email / Password.</p>
            </div> 
            )}
            <div class="form-outline mb-4">
                <label for="exampleInputEmail1">Email: </label>
                <input type="email" id="email" name="email" class="form-control" value = {draftLogin.email} onChange = {handleChange} />
            </div>
            <div class="form-outline mb-4">
                <label for="exampleInputPassword1">Password: </label>
                <input type="password" id="password" name="password" class="form-control" value = {draftLogin.password} onChange = {handleChange}/>
            </div>
            <div>
                <button class="btn btn-success" id="btnsubmitLogin" onClick={() => login(draftLogin, setIsErrorMessage)} value="Submit">Sign In</button>
                <br></br>
                <button class="btn btn-success" id="btnsubmitSignUp" onClick={() => signUp()} value="Submit">Sign Up</button>
            </div>
        </div>
        </>
    )
}

export default Login;