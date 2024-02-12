const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const port = 3000
const path = require('path');
var cors = require('cors');
app.use(bodyParser.json());
app.use(cors());

let updatedData = [];
const fs = require('fs');

app.post('/createTask', (req, res) => {
    const task = req.body.objectTask; // assuming objectTask is a valid JSON object
    // Push the new task to the array
    updatedData.push(task);
    res.json({message: "task successfully added"});
});

app.get('/getTasks', (req, res) => {
    // Get the existing tasks
    res.json(updatedData);
})

app.delete('/removeTasks', (req, res) => {
    //remove task from the array
    const cancelTaskId = req.body.id;
    updatedData = updatedData.filter((task) => task.id !== cancelTaskId);
    res.json({message: "task successfully removed"});
});

//server starts
const server = app.listen(port, () => {
    console.log(`Server has started on port ${port}`);
    console.log('reading the file data....');

    //read the file
    fs.readFile('./data.json', 'utf8', (err, data) => {
        updatedData = JSON.parse(data);
        if (err) {
            // If there's an error reading the file (e.g., file doesn't exist), start with an empty array
            updatedData = [];
        } 
        else if (data.length === 0) {
            // If the file is empty, initialize as an empty array
            const fileContent = data.toString().trim();
            updatedData = fileContent ? JSON.parse(fileContent) : [];
        }
        else {
            console.log("data: ", updatedData);
        }
    })
})

//server ends 
process.on('SIGINT', () => {
    console.log('Ctrl+C was pressed. Writting any updated data to the file before exiting....');

    // Convert the array back to JSON
    updatedData = JSON.stringify(updatedData, null, 2); // null, 2 for pretty-printing

    // Write the updated array back to the file
    fs.writeFile('./data.json', updatedData, (writeErr) => {
        if (writeErr) {
            console.error(writeErr);
            res.status(500).json({ error: 'Error writing file' });
            return;
        }
        else{
            console.log("Successfully written to the file. Now closing the server");
        }
    });
    server.close();
});



