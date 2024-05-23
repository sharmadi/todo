import { Auth } from "./auth";

export function Tasks(){
  const { loginVerf } = Auth();
  const addTask = ( finalDraftTask, setTasks ) => {   
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
        getTask(setTasks);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  }

  const cancelTask = (id, setTasks) => {
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
        getTask(setTasks);
      })
      .catch(error =>  console.error('Error:', error));
  }

  const getTask = (setTasks) => {
    loginVerf();
    fetch(`${import.meta.env.VITE_TODO_API_URL}/getTasks`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setTasks(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }
  return {addTask, cancelTask, getTask}
}