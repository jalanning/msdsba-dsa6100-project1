// Backend: application services, accessible by URIs


const express = require('express')
const cors = require ('cors')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
dotenv.config()

const app = express();

const dbService = require('./dbService');


app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}));

function requireAuth(request, response, next) {
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : null;

    if (!token) {
        return response.status(401).json({error: 'Authentication required'});
    }
    if (!process.env.JWT_SECRET) {
        return response.status(500).json({error: 'Authentication is not configured'});
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
        if (error) {
            return response.status(401).json({error: 'Invalid or expired token'});
        }

        request.user = payload;
        next();
    });
}


app.post('/register/user', (request, response) => {
    console.log("app: register a user.");
    const {username, password, firstname, lastname, salary, age} = request.body;
    const db = dbService.getDbServiceInstance();
    const result = db.registerUser(username, password, firstname, lastname, salary, age);
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.post('/signin', async (request, response) => {
    const {username, password} = request.body;
    const db = dbService.getDbServiceInstance();
    try {
        const success = await db.signInUser(username, password);
        if (!success) {
            return response.status(401).json({success: false});
        }
        if (!process.env.JWT_SECRET) {
            return response.status(500).json({success: false, error: 'Authentication is not configured'});
        }

        const token = jwt.sign({username}, process.env.JWT_SECRET, {expiresIn: '1h'});
        response.json({success: true, token});
    } catch (err) {
        console.log(err);
        response.status(500).json({success: false});
    }
});


app.get('/search/:name', requireAuth, (request, response) => { // we can debug by URL
    
    const {name} = request.params;
    
    console.log(name);

    const db = dbService.getDbServiceInstance();

    db.searchByName(name)
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.get('/search/user/:username', requireAuth, (request, response) => {
    const {username} = request.params;
    console.log(username);
    const db = dbService.getDbServiceInstance();
    const result = db.getUserByUsername(username);
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.get('/search/user/between/salary/:min/:max', requireAuth, (request, response) => {
    const {min, max} = request.params;
    console.log(min, max);
    const db = dbService.getDbServiceInstance();
    const result = db.getUsersBetweenSalaries(min, max);
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.get('/search/usersafterjohn/:username', requireAuth, (request, response) => {
    const {username} = request.params;
    console.log(username);
    const db = dbService.getDbServiceInstance();
    const result = db.getUsersAfterJohnRegisterDay(username);
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.get('/search/user/between/age/:min/:max', requireAuth, (request, response) => {
    const {min, max} = request.params;
    console.log(min, max);
    const db = dbService.getDbServiceInstance();
    const result = db.getUsersBetweenAges(min, max);
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.get('/search/usersnosignin/:username', requireAuth, (request, response) => {
    const {username} = request.params;
    console.log(username);
    const db = dbService.getDbServiceInstance();
    const result = db.getUsersNoSignIn(username);
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.get('/search/userswithsameregisterdayasjohn/:username', requireAuth, (request, response) => {
    const {username} = request.params;
    console.log(username);
    const db = dbService.getDbServiceInstance();
    const result = db.getUsersSameRegisterDayJohn(username);
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.get('/return/registeredtodayusers', requireAuth, (request, response) => {
    const db = dbService.getDbServiceInstance();
    db.getRegisteredTodayUsers()
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.get('/getAllUsers', requireAuth, (request, response) => {
    const db = dbService.getDbServiceInstance();
    db.getAllUsers()
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
