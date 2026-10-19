// Backend: application services, accessible by URIs


const express = require('express')
const cors = require ('cors')
const dotenv = require('dotenv')
dotenv.config()

const app = express();

const dbService = require('./dbService');


app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));


app.post('/register/user', (request, response) => {
    console.log("app: register a user.");
    const {username, password, firstname, lastname, salary, age} = request.body;
    const db = dbService.getDbServiceInstance();
    const result = db.registerUser(username, password, firstname, lastname, salary, age);
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.post('/signin', (request, response) => {
    const {username, password} = request.body;
    const db = dbService.getDbServiceInstance();
    db.signInUser(username, password)
    .then(success => response.json({success}))
    .catch(err => {
        console.log(err);
        response.status(500).json({success: false});
    });
});


app.get('/search/:name', (request, response) => { // we can debug by URL
    
    const {name} = request.params;
    
    console.log(name);

    const db = dbService.getDbServiceInstance();

    let result;
    if(name === "all") // in case we want to search all
       result = db.getAllData()
    else 
       result =  db.searchByName(name); // call a DB function

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});




// set up the web server listener
// if we use .env to configure
/*
app.listen(process.env.PORT, 
    () => {
        console.log("I am listening on the configured port " + process.env.PORT)
    }
);
*/

// if we configure here directly
app.listen(5050, 
    () => {
        console.log("I am listening on the fixed port 5050.")
    }
);
