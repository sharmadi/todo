import { useEffect, useState } from "react"
import './Register.css'
import { useNavigate } from "react-router-dom";

const Register = ({setUser}) => {

    const navigate = useNavigate(); 

    const [draftUser, setDraftUser] = useState({
        email: '',
        password: '',
        userId: null,
    })

    const addUser = () => {
        // let finalUser = draftUser;
        // finalUser.userId = Math.random().toString(16).slice(2);
        // console.log(finalUser);
        // setUser([{finalUser}]);
        setUser([{...draftUser, userId: Math.random().toString(16).slice(2)}]);
        if(draftUser.email != '' && draftUser.password != ''){
            fetch('http://localhost:3000/createUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({objectUser: draftUser})
            })
            .then(response => response.json())
            .then(data => {
                console.log("Response: ", data);
            })
            .catch(error => {
            console.error('Error:', error);
            });
        }
    }

    const reDirect = () => {
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
                    <button class="btn btn-success" id="btnsubmitLogin" onClick={() => addUser()} value="Submit">Sign Up</button>
                    <br></br>
                    <button class="btn btn-success" id="btnsubmitSignUp" onClick={() => reDirect()} value="Submit">Sign In</button>
                </div>
            </div>
    )
}
export default Register; 