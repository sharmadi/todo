const express = require('express')
const path = require("path");
const app = express()
const bodyParser = require('body-parser');
const port = 3000
const http = require("http");
var cors = require('cors');
app.use(bodyParser.json());
app.use(cors());
let loginData = [];
let userData = []
let updatedData = [];
let currentUserId = '';
const fs = require('fs');

app.post('/login', (req, res) => {
    loginData = req.body.loginInfo;
    for(const key in userData){
        if(loginData.email == userData[key].email && loginData.password == userData[key].password){
            res.status(200).json({message: "successfully logged in."});
            currentUserId = userData[key].userId;
        }    
    }
    res.status(404).json({message: "user not found."});
});

app.post('/createUser', (req,res) => {
    const userInfo = req.body.objectUser;
    userData.push(userInfo);
    res.status(200).json({message: "user successfully created"});
});

app.post('/createTask', (req, res) => {
    const task = req.body.objectTask;
    task.userId = currentUserId;
    updatedData.push(task);
    console.log(updatedData);
    res.json({message: "task successfully added"});
});

app.delete('/removeTask', (req, res) => {
    const cancelTaskId = req.body.taskId;
    console.log("removing", cancelTaskId);
    updatedData = updatedData.filter((task) => task.id !== cancelTaskId);
    res.json({message: "task successfully removed"});
});

app.get('/logout', (req, res) => {
    currentUserId = '';
    res.json(currentUserId);
});

app.get('/getCurrentUserId', (req, res) => {
    res.json(currentUserId);
});

app.get('/getTasks', (req, res) => {
    let userTaskData = [];
    if(updatedData.length != 0){
        for(const key in updatedData){
            if(currentUserId == updatedData[key].userId && currentUserId != null){
                userTaskData.push(updatedData[key]);
            }
        }
    }
    userTaskData.reverse();
    res.json(userTaskData);
});

const server = http.createServer(app);

//server starts
server.listen(port, () => {
    console.log(`Server has started on port ${port}`);
    console.log('reading the file data....');

    //read the data file
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
            console.log("Task data: ", updatedData);
        }
    })

    //read the user file
    fs.readFile('./user.json', 'utf8', (err, data) => {
        userData = JSON.parse(data);
        if (err) {
            // If there's an error reading the file (e.g., file doesn't exist), start with an empty array
            userData = [];
        } 
        else if (data.length === 0) {
            // If the file is empty, initialize as an empty array
            const fileContent = data.toString().trim();
            userData = fileContent ? JSON.parse(fileContent) : [];
        }
        else {
            console.log("User data: ", userData);
        }
    })

}).on('error', function(err){
    console.error(err);
})
//server ends 
process.on('SIGINT', () => {

    console.log('Writting any updated data to the files before exiting....');

    // Convert the arrays back to JSON
    updatedData = JSON.stringify(updatedData, null, 2);
    userData = JSON.stringify(userData, null, 2);

    // Write the updated data back to the files
    fs.writeFile('./data.json', updatedData, (writeErr) => {
        if (writeErr) {
            console.error(writeErr);
            res.status(500).json({ error: 'Error writing file' });
            return;
        }
        else{
            console.log("Successfully written to the data file.");
        }

        fs.writeFile('./user.json', userData, (writeErr) => {
            if (writeErr) {
                console.error(writeErr);
                res.status(500).json({ error: 'Error writing file' });
                return;
            }
            else {
                console.log("Successfully written to the user file. Now closing the server....");
                server.close();
            }
        });
    });
});