import Todo from './Todo.jsx'
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import Login from './Login.jsx';
import Register from './Register.jsx';

const App = () => {
    return (
        <BrowserRouter basename="/">
            <Routes>
                <Route path = "login" element={<Login/>} />
                <Route path = "register" element={<Register/>} />
                <Route path = "todo" element={<Todo/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
