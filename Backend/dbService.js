// database services, accessbile by DbService methods.

const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config(); // read from .env file

let instance = null; 


// if you use .env to configure
console.log("HOST: " + process.env.HOST);
console.log("DB USER: " + process.env.DB_USER);
console.log("PASSWORD: " + process.env.PASSWORD);
console.log("DATABASE: " + process.env.DATABASE);
console.log("DB PORT: " + process.env.DB_PORT);

const connection = mysql.createConnection({
     host: process.env.HOST,
     user: process.env.DB_USER,        
     password: process.env.PASSWORD,
     database: process.env.DATABASE,
     port: process.env.DB_PORT
});


// if you configure directly in this file, there is a security issue, but it will work
/*
const connection = mysql.createConnection({
     host:"localhost",
     user:"root",        
     password:"",
     database:"web_app",
     port:3306
});
*/


connection.connect((err) => {
     if(err){
        console.log(err.message);
     }
     console.log('db ' + connection.state);    // to see if the DB is connected or not
});

// the following are database functions, 

class DbService{
    static getDbServiceInstance(){ // only one instance is sufficient
        return instance? instance: new DbService();
    }

   /*
     This code defines an asynchronous function getAllData using the async/await syntax. 
     The purpose of this function is to retrieve all data from a database table named 
     "names" using a SQL query.

     Let's break down the code step by step:
         - async getAllData() {: This line declares an asynchronous function named getAllData.

         - try {: The try block is used to wrap the code that might throw an exception 
            If any errors occur within the try block, they can be caught and handled in 
            the catch block.

         - const response = await new Promise((resolve, reject) => { ... });: 
            This line uses the await keyword to pause the execution of the function 
            until the Promise is resolved. Inside the await, there is a new Promise 
            being created that represents the asynchronous operation of querying the 
            database. resolve is called when the database query is successful, 
            and it passes the query results. reject is called if there is an error 
            during the query, and it passes an Error object with an error message.

         - The connection.query method is used to execute the SQL query on the database.

         - return response;: If the database query is successful, the function returns 
           the response, which contains the results of the query.

        - catch (error) {: The catch block is executed if an error occurs anywhere in 
           the try block. It logs the error to the console.

        - console.log(error);: This line logs the error to the console.   
    }: Closes the catch block.

    In summary, this function performs an asynchronous database query using await and a 
   Promise to fetch all data from the "names" table. If the query is successful, 
   it returns the results; otherwise, it catches and logs any errors that occur 
   during the process. It's important to note that the await keyword is used here 
   to work with the asynchronous nature of the connection.query method, allowing 
   the function to pause until the query is completed.
   */

   async searchByName(name){
        try{
             // use await to call an asynchronous function
             const response = await new Promise((resolve, reject) => 
                  {
                     const query = "SELECT * FROM names where name = ?;";
                     connection.query(query, [name], (err, results) => {
                         if(err) reject(new Error(err.message));
                         else resolve(results);
                     });
                  }
             );

             // console.log(response);  // for debugging to see the result of select
             return response;

         }  catch(error){
            console.log(error);
         }
   }

  async registerUser(username, password, firstname, lastname, salary, age){
      try{
         const registerDay = new Date();
         const signinTime = new Date();
         // use await to call an asynchronous function
         const response = await new Promise((resolve, reject) => 
             {
                const query = "INSERT INTO users (username, password, firstname, lastname, salary, age, registerday, signintime) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
                connection.query(query, [username, password, firstname, lastname, salary, age, registerDay, signinTime], (err, result) => {
                     if(err) reject(new Error(err.message));
                     else resolve(result.insertId);
                });
             }
          );
          console.log(response);
          return {
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname,
            salary: salary,
            age: age,
            registerday: registerDay,
            signintime: signinTime
          }  

      }  catch(error){
         console.log(error);
      }
   }     

   async signInUser(username, password){
      try{
         const rows = await new Promise((resolve, reject) => {
            const query = "SELECT 1 FROM users WHERE username = ? AND password = ? LIMIT 1;";
            connection.query(query, [username, password], (err, results) => {
               if(err) reject(new Error(err.message));
               else resolve(results);
            });
         });
         if (rows.length === 0)
            return false;
         await new Promise((resolve, reject) => {
            const query = "UPDATE users SET signintime = ? WHERE username = ?;";
            const signinTime = new Date();
            connection.query(query, [signinTime, username], (err, result) => {
               if(err) reject(new Error(err.message));
               else resolve(result);
            });
         });
         return true;
      } catch(error){
         console.log(error);
         throw error;
      }
   }
}
module.exports = DbService;
