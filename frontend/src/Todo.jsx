import { useEffect, useState } from "react";
import './Todo.css'
import { useNavigate } from "react-router-dom";

const Todo = () => {

  const navigate = useNavigate(); 

  let loginEmail = '';
  let loginPassword = '';
  let currentUserId = '';
  let taskData = [];


  // an array of strings (tasks)
  const [tasks, setTasks] = useState([]);

  const [isOpen, setIsOpen] = useState(false);


  // latest input values
  const [draftTask, setDraftTask] = useState({
    task_name: '',
    date: '',
    category: '',
    id: '',
    userId: ''
  });

  useEffect(() => {
    getTask();
  }, []);

  const login = () => {
    fetch('http://localhost:3000/getClearLoginInfo')
    .then(response => response.json())
    .then(data => {
      if(JSON.stringify(data) == '[]')
        navigate("/login");
    })
  }

  const loginVerf = () => {
    fetch('http://localhost:3000/getLoginInfo')
      .then(response => response.json())
      .then(data => {
        if(JSON.stringify(data) == '[]')
          navigate("/login");
        console.log("get login info ...", data);
        loginEmail = data.email;
        loginPassword = data.password;
      })
    .catch(error => console.error('Error fetching data:', error));

    fetch('http://localhost:3000/getUserInfo')
      .then(response => response.json())
      .then(data => {
        console.log("get users info ...", data);
        for(const key in data){
          if(loginEmail == data[key].email && loginPassword == data[key].password)
            currentUserId = data[key].userId;
        }
        console.log("current User Id:", currentUserId);
        draftTask.userId = currentUserId;
        console.log(draftTask);
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  const addTask = () => {   
    let finalDraftTask = draftTask;
    finalDraftTask.id = Math.random().toString(16).slice(2);
    console.log(currentUserId);
    setTasks([...tasks, {...finalDraftTask}]);
    if(finalDraftTask.task_name != ""){
      fetch('http://localhost:3000/createTask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({objectTask: finalDraftTask})
      })
      .then(response => response.json())
      .then(data => {
        console.log("Response: ", data);
        getTask();
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  }

  const getTask = () => {
    loginVerf();
    console.log("currentUserId:", currentUserId);
    fetch('http://localhost:3000/getTasks')
      .then(response => response.json())
      .then(data => {
        console.log("get data ...", data);
        for(const key in data){
          if(currentUserId == data[key].userId){
            taskData.push(data[key]);
          }
        }
        setTasks(taskData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  const cancelTask = (id) => {
    console.log("deleting", id);
    //remove data from server
    fetch('http://localhost:3000/removeTasks', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({taskId: id})
    })
      .then(response => response.json())
      .then(data => {
        console.log("Response: ", data);
        getTask();
      })
      .catch(error =>  console.error('Error:', error));
  }

  const openNav = () => {
    setIsOpen(true);
  }

  const closeNav = () => {
    setIsOpen(false);
  }

  // handles what is typed
  const handleChange = (e) => {
    setDraftTask({ ...draftTask, [e.target.name]: e.target.value });
  }

  return (
    <>
      {isOpen && (
          <div id="mySidenav" class="sidenav">
            <a href="javascript:void(0)" class="closebtn" onClick={() => closeNav()}>&times;</a>
            <div class="container text-center">
            <div class = "createTaskHeader">
              <h3>Create Task</h3>
            </div>
              <br></br>
              <input type="text" name="task_name" id="task_name" onfocus="this.value=''" value={draftTask.task_name} onChange={handleChange} class="form-control rounded" placeholder="Enter Your Task" aria-label="Add Task" aria-describedby="search-addon" required></input>
              <br></br>
              <select class="form-select" name="category" id="category" aria-label="Default select example" value={draftTask.category} placeholder="Choose category" onChange={handleChange} onfocus="this.value=''" required>
                <option value="category" selected>Choose a category</option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="School">School</option>
              </select>
              <br></br>
              <label for="date">Due Date:</label>
              {" "}
              <input type="date" name="date" id="date" onfocus="this.value=''" value={draftTask.date} onChange={handleChange} placeholder="Enter Due Date"></input>
              <br></br>
              <br></br>
              <div class = "addTaskButton">
                <button class="btn btn-success" id="btnsubmit" onClick={() => addTask()} value="Submit" title="Add Task">Add Task</button>
              </div>
            </div>
          </div>
      )} 
        <span style={{fontSize: '30px', cursor: 'pointer'}} id="openNav" onClick={() => openNav()}>&#9776;</span>
        <div class="tasks">
          <button class="btn btn-lg text-center" id="btnsubmit" onClick={() => login()} value="Submit"><h5>Logout</h5></button>
          <div class = "taskHeader">
            <h3>Tasks</h3>
          </div>
            {
              tasks.map((task) => (
                <>
                  <div className="card card-body card-style">
                    <i class="fa fa-close" onClick={() => cancelTask(task.id)}></i>
                    <span>Task Name: {task.task_name}</span>
                    <br></br>
                    <span>Due: {task.date}</span>
                    <br></br>
                    <span>Category: {task.category}</span>
                  </div>
                </>
              ))
            }
        </div>
    </>
  )
}

export default Todo;
