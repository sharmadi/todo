import { useEffect, useState } from "react";
import './styles/Todo.css'
import { Auth } from "./api/auth";
import { Tasks } from "./api/task";

const Todo = () => {
  // an array of strings (tasks)
  const [tasks, setTasks] = useState([]);

  const [open, setOpen] = useState(false);

  const { logOut } = Auth();

  const { addTask, getTask, cancelTask } = Tasks();

  const [draftTask, setDraftTask] = useState({
    task_name: '',
    date: '',
    category: '',
    id: '',
    userId: ''
  });

  useEffect(() => {
    getTask(setTasks);
  }, []);

  useEffect(() => {
    if (open) {
      document.querySelector('.tasks').style.opacity = 0.3;
    } else {
      document.querySelector('.tasks').style.opacity = 1;
    }
  }, [open]);

  const closePopUp = () => {
    setOpen(false);
  }

  const createTask = () => {
    let finalDraftTask = draftTask;
    finalDraftTask.id = Math.random().toString(16).slice(2);
    setOpen(false);
    setTasks([...tasks, {...finalDraftTask}]);
    addTask(finalDraftTask, setTasks)
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
              <button class="btn btn-success" id="btnsubmitTask" onClick={() => createTask()} value="Submit" title="Add Task">Submit</button>
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
            {tasks.reverse().map((task) => task.task_name && (
              <>
                <div className="card border-light card-style">
                  <div style = {{display: "inline-flex"}}>
                    <span id = "taskCategory">{task.category}</span>
                    <i class="fa fa-close" id="taskClose" onClick={() => cancelTask(task.id, setTasks)}></i>
                  </div>
                  <span id = "taskName">{task.task_name}</span>
                  <br></br>
                  <span id = "taskDate">{task.date ? new Date(task.date).toDateString() : ""}</span>
                </div>
              </>
            ))}
          </div>
        </div>
        </>
  )
}

export default Todo;
