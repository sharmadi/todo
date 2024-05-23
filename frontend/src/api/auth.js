import { useNavigate } from "react-router-dom";

export function Auth(){
    const navigate = useNavigate();
    const login = (draftLogin, setIsErrorMessage) => {
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
    const loginVerf = () => {
        fetch(`${import.meta.env.VITE_TODO_API_URL}/getCurrentUserId`)
        .then(response => response.json())
        .then(data => {
            console.log("Current user id:", data);
            if(data == '')
                navigate("/login");
        })
        .catch(error => console.error('Error fetching data:', error));
    }
    const logOut = () => {
        fetch(`${import.meta.env.VITE_TODO_API_URL}/logout`)
        .then(response => response.json())
        .then(data => {
            console.log("current user id emptied.");
            navigate("/login");
        })
    }
    return {login, loginVerf, logOut}
}