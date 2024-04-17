import { useEffect, useState } from "react";
import './Login.css'
import { useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate(); 

    const [draftLogin, setDraftLogin] = useState({
        email: '',
        password: ''
    })

    const [isErrorMessage, setIsErrorMessage] = useState(false);

    const signUp = () => {
        navigate("/register");
    }

    const login = () => {
        fetch(`${import.meta.env.VITE_TODO_API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({loginInfo: draftLogin})
        })
            .then(response => {
                console.log("response status: ", response.status);
                if(response.status == 200){
                    navigate("/todo");
                }
                else{
                    setIsErrorMessage(true);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
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
                <button class="btn btn-success" id="btnsubmitLogin" onClick={() => login()} value="Submit">Sign In</button>
                <br></br>
                <button class="btn btn-success" id="btnsubmitSignUp" onClick={() => signUp()} value="Submit">Sign Up</button>
            </div>
        </div>
        </>
    )
}

export default Login;