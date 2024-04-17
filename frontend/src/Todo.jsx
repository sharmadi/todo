import { useEffect, useState } from "react";
import Popup from 'reactjs-popup';
import './Todo.css'
import { useNavigate } from "react-router-dom";

const Todo = () => {

  const navigate = useNavigate(); 


  // an array of strings (tasks)
  const [tasks, setTasks] = useState([]);

  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    if (open) {
      document.querySelector('.tasks').style.opacity = 0.3;
    } else {
      document.querySelector('.tasks').style.opacity = 1;
    }
  }, [open]);


  const logOut = () => {
    fetch(`${import.meta.env.VITE_TODO_API_URL}/logout`)
    .then(response => response.json())
    .then(data => {
      console.log("current user id emptied.");
      navigate("/login");
    })
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

  const addTask = () => {   
    let finalDraftTask = draftTask;
    finalDraftTask.id = Math.random().toString(16).slice(2);
    setTasks([...tasks, {...finalDraftTask}]);
    if(finalDraftTask.task_name != ""){
      fetch(`${import.meta.env.VITE_TODO_API_URL}/createTask`, {
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
    fetch(`${import.meta.env.VITE_TODO_API_URL}/getTasks`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setTasks(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  const cancelTask = (id) => {
    console.log("deleting", id);
    fetch(`${import.meta.env.VITE_TODO_API_URL}/removeTask`, {
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

  const closePopUp = () => {
    setOpen(false);
  }

  // handles what is typed
  const handleChange = (e) => {
    setDraftTask({ ...draftTask, [e.target.name]: e.target.value });
  }

  return (
    <>
      {open && (
        <>
          <div id="popup">
            <div class="container text-center">
            <i class="fa fa-close" id = "closeModal" onClick={() => closePopUp()}></i>
              <div class="createTaskHeader">
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
              {' '}
              <input type="date" name="date" id="date" onfocus="this.value=''" value={draftTask.date} onChange={handleChange} placeholder="Enter Due Date"></input>
              <button class="btn btn-success" id="btnsubmitTask" onClick={() => addTask()} value="Submit" title="Add Task">Submit</button>
            </div>
          </div>
        </>
      )}
        <div className="tasks">
            <button class="btn btn-lg text-center" id="btnsubmit" onClick={() => logOut()} value="Submit"><h5>Logout</h5></button>
          <div class = "taskBody">
            <div class="taskHeader">
              <h3>My Tasks</h3>
            </div>
            <button onClick={() => setOpen(!open)} type="button" id="addTaskPopUp" className="btn btn-success" data-toggle="modal">+</button>
            {tasks.reverse().map((task) => (
              <>
                <div className="card card-body card-style">
                  <i class="fa fa-close" id="taskClose" onClick={() => cancelTask(task.id)}></i>
                  <span id = "taskName">{task.task_name}</span>
                  <br></br>
                  <span id = "taskDate">{task.date}</span>
                  <br></br>
                  <span id = "taskCategory">{task.category}</span>
                </div>
              </>
            ))}
          </div>
        </div>
        </>
  )
}

export default Todo;
