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
    db.registerUser(username, password, firstname, lastname, salary, age)
        .then(data => response.json({data: data}))
        .catch(err => {
            console.log(err);
            response.status(500).json({error: 'Internal server error'});
        });
});

app.post('/signin', async (request, response) => {
    if (!process.env.JWT_SECRET) {
        return response.status(500).json({success: false, error: 'Authentication is not configured'});
    }
    const {username, password} = request.body;
    
    const db = dbService.getDbServiceInstance();
    db.signInUser(username, password)
        .then(success => {
            if (!success) {
                return response.status(401).json({success: false});
            }

            const token = jwt.sign({username}, process.env.JWT_SECRET, {expiresIn: '1h'});
            response.json({success: true, token});
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({success: false});
        });
});


app.get('/search/byName', requireAuth, (request, response) => { // we can debug by URL
    const {name} = request.query;
    console.log(name);
    const db = dbService.getDbServiceInstance();
    db.searchByName(name)
        .then(data => response.json({data: data}))
        .catch(err => {
            console.log(err);
            response.status(500).json({error: 'Internal server error'});
        });
});

app.get('/search/byUsername', requireAuth, (request, response) => {
    const {username} = request.query;
    console.log(username);
    const db = dbService.getDbServiceInstance();
    db.getUserByUsername(username)
        .then(data => response.json({data: data}))
        .catch(err => {
            console.log(err);
            response.status(500).json({error: 'Internal server error'});
        });
});

app.get('/search/bySalary', requireAuth, (request, response) => {
    const {min, max} = request.query;
    console.log(min, max);
    const db = dbService.getDbServiceInstance();
    db.getUsersBetweenSalaries(min, max)
        .then(data => response.json({data: data}))
        .catch(err => {
            console.log(err);
            response.status(500).json({error: 'Internal server error'});
        });
});

app.get('/search/byAge', requireAuth, (request, response) => {
    const {min, max} = request.query;
    console.log(min, max);
    const db = dbService.getDbServiceInstance();
    db.getUsersBetweenAges(min, max)
        .then(data => response.json({data: data}))
        .catch(err => {
            console.log(err);
            response.status(500).json({error: 'Internal server error'});
        });
});

app.get('/list/usersafterjohn', requireAuth, (request, response) => {
    const db = dbService.getDbServiceInstance();
    db.getUsersAfterJohnRegisterDay()
        .then(data => response.json({data: data}))
        .catch(err => {
            console.log(err);
            response.status(500).json({error: 'Internal server error'});
        });
});


app.get('/list/userswithsameregisterdayasjohn', requireAuth, (request, response) => {
    const db = dbService.getDbServiceInstance();
    db.getUsersSameRegisterDayJohn()
        .then(data => response.json({data: data}))
        .catch(err => {
            console.log(err);
            response.status(500).json({error: 'Internal server error'});
        });
});

app.get('/list/usersnosignin', requireAuth, (request, response) => {
    const db = dbService.getDbServiceInstance();
    db.getUsersNoSignIn()
        .then(data => response.json({data: data}))
        .catch(err => {
            console.log(err);
            response.status(500).json({error: 'Internal server error'});
        });
});

app.get('/list/registeredtodayusers', requireAuth, (request, response) => {
    const db = dbService.getDbServiceInstance();
    db.getRegisteredTodayUsers()
        .then(data => response.json({data: data}))
        .catch(err => {
            console.log(err);
            response.status(500).json({error: 'Internal server error'});
        });
});
    
app.get('/list/all', requireAuth, (request, response) => {
    const db = dbService.getDbServiceInstance();
    db.getAllUsers()
        .then(data => response.json({data: data}))
        .catch(err => {
            console.log(err);
            response.status(500).json({error: 'Internal server error'});
        });
});

// if we configure here directly
app.listen(5050, 
    () => {
        console.log("I am listening on the fixed port 5050.")
    }
);
