const express = require('express')
const path = require("path");
const app = express()
const bodyParser = require('body-parser');
const port = 3000
const http = require("http");
var cors = require('cors');
app.use(bodyParser.json());
app.use(cors());
let userData = []
let updatedData = [];
let loginInfo = [];
const fs = require('fs');

app.post('/createUser', (req,res) => {
    const userInfo = req.body.objectUser;
    userData.push(userInfo);
    res.json({message: "user successfully created"});
})

app.post('/login', (req,res) => {
    loginInfo = req.body.loginInfo;
    var email = loginInfo.email;
    var password = loginInfo.password;
    //traverse through userData array
    for(const key in userData){
        let userEmail = userData[key].email;
        let userPassword = userData[key].password; 
        if(userEmail == email && password == userPassword){
            res.json({message:"successful login", email: email, password: password});
        }
    }
});

app.get('/getUserInfo', (req,res) => {
    res.json(userData);
});

app.get('/getLoginInfo', (req,res) => {
    res.json(loginInfo);
});

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
    });
    fs.writeFile('./user.json', userData, (writeErr) => {
        if (writeErr) {
            console.error(writeErr);
            res.status(500).json({ error: 'Error writing file' });
            return;
        }
        else{
            console.log("Successfully written to the user file. Now closing the server....");
        }
    });
    server.close();
});



