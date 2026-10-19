
// This is the frontEnd that modifies the HTML page directly
// event-based programming,such as document load, click a button

/*
What is a Promise in Javascript? 

A Promise can be in one of three states:

    - Pending: The initial state; the promise is neither fulfilled nor rejected.

    - Fulfilled: The operation completed successfully, and the promise has a 
      resulting value.

    - Rejected: The operation failed, and the promise has a reason for the failure.

Promises have two main methods: then and catch.

    - The then method is used to handle the successful fulfillment of a promise. 
    It takes a callback function that will be called when the promise is resolved, 
    and it receives the resulting value.

    - The catch method is used to handle the rejection of a promise. It takes a 
    callback function that will be called when the promise is rejected, and it 
    receives the reason for the rejection.

What is a promise chain? 
    The Promise chain starts with some asyncOperation1(), which returns a promise, 
    and each subsequent ``then`` is used to handle the result of the previous Promise.

    The catch is used at the end to catch any errors that might occur at any point 
    in the chain.

    Each then returns a new Promise, allowing you to chain additional ``then`` calls to 
    handle subsequent results.

What is an arrow function?

    An arrow function in JavaScript is a concise way to write anonymous function 
    expressions.

    Traditional function syntax: 
        const add = function(x, y) {
           return x + y;
        };

    Arrow function syntax:
        const add = (x, y) => x + y;
    
    
Arrow functions have a few notable features:

    - Shorter Syntax: Arrow functions eliminate the need for the function keyword, 
      curly braces {}, and the return keyword in certain cases, making the syntax 
      more concise.

    - Implicit Return: If the arrow function consists of a single expression, it is 
      implicitly returned without needing the return keyword.

    - Lexical this: Arrow functions do not have their own this context; instead, they 
      inherit this from the surrounding code. This can be beneficial in certain situations,
      especially when dealing with callbacks and event handlers.
*/


function signIn() {
    const username = document.querySelector('#signin-username-input').value;
    const password = document.querySelector('#signin-password-input').value;
    const message = document.querySelector('#signin-message');

    fetch('http://localhost:5050/signin', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({username, password})
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            message.textContent = 'Invalid username or password.';
            return;
        }

        message.textContent = '';
        document.querySelector('#user-list').hidden = false;
        return fetch('http://localhost:5050/getAll');
    })
    .then(response => response && response.json())
    .then(data => data && loadHTMLTable(data.data))
    .catch(() => {
        message.textContent = 'Unable to sign in. Please try again.';
    });
}


// when the addBtn is clicked

function addUser() {
    const usernameInput = document.querySelector('#username-input');
    const passwordInput = document.querySelector('#password-input');
    const firstNameInput = document.querySelector('#first-name-input');
    const lastNameInput = document.querySelector('#last-name-input');
    const ageInput = document.querySelector('#age-input');
    const salaryInput = document.querySelector('#salary-input');

    const username = usernameInput.value;
    const password = passwordInput.value;
    const firstname = firstNameInput.value;
    const lastname = lastNameInput.value;
    const age = ageInput.value;
    const salary = salaryInput.value;

    usernameInput.value = "";
    passwordInput.value = "";
    firstNameInput.value = "";
    lastNameInput.value = "";
    ageInput.value = "";
    salaryInput.value = "";

    fetch('http://localhost:5050/register/user', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            username,
            password,
            firstname,
            lastname,
            age,
            salary
        })
    })
    .then(response => response.json())
    .then(data => console.log(data));
}

function loadHTMLTable(data){
    debug("index.js: loadHTMLTable called.");

    const table = document.querySelector('table tbody'); 
    
    if(data.length === 0){
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }
  
    /*
    In the following JavaScript code, the forEach method is used to iterate over the 
    elements of the data array. The forEach method is a higher-order function 
    that takes a callback function as its argument. The callback function is 
    executed once for each element in the array.
    
    In this case, the callback function takes a single argument, which is an object 
    destructuring pattern:


    function ({id, name, date_added}) {
        // ... code inside the callback function
    }

    This pattern is used to extract the id, name, and date_added properties from each 
    element of the data array. The callback function is then executed for each element
    in the array, and within the function, you can access these properties directly 
    as variables (id, name, and date_added).

    
    In summary, the forEach method is a convenient way to iterate over each element in 
    an array and perform some operation or execute a function for each element. 
    The provided callback function is what gets executed for each element in the 
    data array.
    */

    let tableHtml = "";
    data.forEach(function ({id, name, date_added}){
         tableHtml += "<tr>";
         tableHtml +=`<td>${id}</td>`;
         tableHtml +=`<td>${name}</td>`;
         tableHtml +=`<td>${new Date(date_added).toLocaleString()}</td>`;
         tableHtml +=`<td><button class="delete-row-btn" data-id=${id}>Delete</td>`;
         tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td>`;
         tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}
