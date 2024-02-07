const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const port = 3000
const path = require('path');
var cors = require('cors');
app.use(bodyParser.json());
app.use(cors());

let myObject = [];

const fs = require('fs');

app.post('/createTask', (req, res) => {
    const task = req.body.objectTask; // assuming objectTask is a valid JSON object

    // Read the existing data from file
    fs.readFile('./data.json', (err, data) => {

        if (err) {
            // If there's an error reading the file (e.g., file doesn't exist), start with an empty array
            myObject = [];
        } else {
            // If the file is empty, initialize as an empty array
            const fileContent = data.toString().trim();
            myObject = fileContent ? JSON.parse(fileContent) : [];
        }

        // Push the new task to the array
        myObject.push(task);
        console.log("create task", myObject);

        // Convert the array back to JSON
        let newData = JSON.stringify(myObject, null, 2); // null, 2 for pretty-printing

        // Write the updated array back to the file
        fs.writeFile('./data.json', newData, (writeErr) => {
            if (writeErr) {
                console.error(writeErr);
                res.status(500).json({ error: 'Error writing file' });
                return;
            }
            res.json({ message: "task added to the server" });
        });
    });
});

app.get('/getTasks', (req, res) => {
    // Read the existing data from file
    fs.readFile('./data.json', 'utf-8', (err, data) => {
        
        if (err) {
            res.status(500).json({ error: 'Error reading file' });
            return;
        } else {
            const updatedData = JSON.parse(data);
            res.json(updatedData);
        }
    });
});

app.delete('/removeTasks', (req, res) => {

    fs.readFile('./data.json', (err, data) => {
        if (err) {
            // If there's an error reading the file (e.g., file doesn't exist), start with an empty array
            console.log("error");
        }
        const cancelTaskId = req.body.id;
        myObject = myObject.filter((task) => task.id !== cancelTaskId)

        // Convert the array back to JSON
        let newData = JSON.stringify(myObject, null, 2); // null, 2 for pretty-printing

        // Write the updated array back to the file
        fs.writeFile('./data.json', newData, (writeErr) => {
            if (writeErr) {
                console.error(writeErr);
                res.status(500).json({ error: 'Error writing file' });
                return;
            }
            res.json({ message: "task removed from the server" });
        });
    });
});

process.on('SIGTERM', () => {
    console.log("closed");
})
process.on('SIGINT', () => {
    console.log("closed");
})
app.listen(port, () => {
  console.log(`Server has started on port ${port}`)
})