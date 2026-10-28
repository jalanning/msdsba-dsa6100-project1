function hideOrShowElements(show) {
    document.querySelector('#user-list').hidden = !show;
    document.querySelector('#search-by-user').hidden = !show;
    document.querySelector('#search-by-name').hidden = !show;
    document.querySelector('#salary-section').hidden = !show;
    document.querySelector('#age-section').hidden = !show;
    document.querySelector('#users-after-john').hidden = !show;
    document.querySelector('#users-no-signin').hidden = !show;
    document.querySelector('#users-same-register-day-john').hidden = !show;
    document.querySelector('#users-registered-today').hidden = !show;
}

function handle401() {
    sessionStorage.removeItem('authToken');
    hideOrShowElements(false);
    document.querySelector('#signin-message').textContent = 'Please sign in again.';
}

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

        sessionStorage.setItem('authToken', data.token);
        hideOrShowElements(true);
    })
}

function authenticatedFetch(url, options = {}) {
    const token = sessionStorage.getItem('authToken');
    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`
        }
    });
}


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

function getAllUsers() {
    authenticatedFetch('http://localhost:5050/list/all')
        .then(response => {
            if (response.status === 401) {
                handle401();
                return null;
            }
            if (!response.ok) throw new Error('Request failed');
            return response.json();
        })
        .then(data => data && loadHTMLTable(data.data, '#all-users-table tbody'))
        .catch(() => {
            document.querySelector('#signin-message').textContent = 'Unable to load users.';
        });
}

function searchbyName(){
    const nameInput = document.querySelector('#name-search-input');
    const name = nameInput.value;
    authenticatedFetch(`http://localhost:5050/search/byName?name=${encodeURIComponent(name)}`)
        .then(response => {
            if (response.status === 401) {
                handle401();
                return null;
            }
            if (!response.ok) throw new Error('Search request failed');
            return response.json();
        })
        .then(data => data && loadHTMLTable(data.data, '#name-table tbody'))
        .catch(() => {
            document.querySelector('#name-search-message').textContent = 'Unable to load users.';
        });
}

function searchbyUser(){
    const usernameInput = document.querySelector('#username-search-input');
    const username = usernameInput.value;
    authenticatedFetch(`http://localhost:5050/search/byUsername?username=${encodeURIComponent(username)}`)
        .then(response => {
            if (response.status === 401) {
                handle401();
                return null;
            }
            if (!response.ok) throw new Error('Search request failed');
            return response.json();
        })
        .then(data => data && loadHTMLTable(data.data, '#username-table tbody'))
        .catch(() => {
            document.querySelector('#username-search-message').textContent = 'Unable to load users.';
        });
}

function getUserBetweenSalaryRange() {
    const minSalaryInput = document.querySelector('#min-salary-input');
    const maxSalaryInput = document.querySelector('#max-salary-input');
    const minSalary = minSalaryInput.value;
    const maxSalary = maxSalaryInput.value;
    authenticatedFetch(`http://localhost:5050/search/bySalary?min=${encodeURIComponent(minSalary)}&max=${encodeURIComponent(maxSalary)}`)
        .then(response => {
            if (response.status === 401) {
                handle401();
                return null;
            }
            if (!response.ok) throw new Error('Search request failed');
            return response.json();
        })
        .then(data => data && loadHTMLTable(data.data, '#salary-table tbody'))
        .catch(() => {
            document.querySelector('#salary-search-message').textContent = 'Unable to load users.';
        });
}

function getUserBetweenAgeRange() {
    const minAgeInput = document.querySelector('#min-age-input');
    const maxAgeInput = document.querySelector('#max-age-input');
    const minAge = minAgeInput.value;
    const maxAge = maxAgeInput.value;
    authenticatedFetch(`http://localhost:5050/search/byAge?min=${encodeURIComponent(minAge)}&max=${encodeURIComponent(maxAge)}`)
        .then(response => {
            if (response.status === 401) {
                handle401();
                return null;
            }
            if (!response.ok) throw new Error('Search request failed');
            return response.json();
        })
        .then(data => data && loadHTMLTable(data.data, '#age-table tbody'))
        .catch(() => {
            document.querySelector('#age-search-message').textContent = 'Unable to load users.';
        });
}

function getUsersAfterJohnRegisterDay(){
    authenticatedFetch(`http://localhost:5050/list/usersafterjohn/`)
        .then(response => {
            if (response.status === 401) {
                handle401();
                return null;
            }
            if (!response.ok) throw new Error('Search request failed');
            return response.json();
        })
        .then(data => data && loadHTMLTable(data.data, '#users-after-john-table tbody'))
        .catch(() => {
            document.querySelector('#users-after-john-search-message').textContent = 'Unable to load users.';
        });
}

function getUsersNoSignIn(){
    authenticatedFetch(`http://localhost:5050/list/usersnosignin`)
        .then(response => {
            if (response.status === 401) {
                handle401();
                return null;
            }
            if (!response.ok) throw new Error('Search request failed');
            return response.json();
        })
        .then(data => data && loadHTMLTable(data.data, '#users-no-signin-table tbody'))
        .catch(() => {
            document.querySelector('#users-no-signin-search-message').textContent = 'Unable to load users.';
        });
}

function getUsersSameRegisterDayJohn(){
    authenticatedFetch(`http://localhost:5050/list/userswithsameregisterdayasjohn`)
        .then(response => {
            if (response.status === 401) {
                handle401();
                return null;
            }
            if (!response.ok) throw new Error('Search request failed');
            return response.json();
        })
        .then(data => data && loadHTMLTable(data.data, '#users-same-register-day-john-table tbody'))
        .catch(() => {
            document.querySelector('#users-same-register-day-john-search-message').textContent = 'Unable to load users.';
        });
}

function getRegisteredTodayUsers() {
    authenticatedFetch(`http://localhost:5050/list/registeredtodayusers`)
        .then(response => {
            if (response.status === 401) {
                handle401();
                return null;
            }
            if (!response.ok) throw new Error('Search request failed');
            return response.json();
        })
        .then(data => data && loadHTMLTable(data.data, '#users-registered-today-table tbody'))
        .catch(() => {
            document.querySelector('#users-registered-today-search-message').textContent = 'Unable to load users.';
        });
}

function loadHTMLTable(data, tableId = 'table tbody'){
    const table = document.querySelector(tableId); 
    
    if(data.length === 0){
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }

    let tableHtml = "";
    data.forEach(function ({username, firstname, lastname, age, salary, registerday, signintime}){
         tableHtml += "<tr>";
         tableHtml +=`<td>${username}</td>`;
         tableHtml +=`<td>${firstname}</td>`;
         tableHtml +=`<td>${lastname}</td>`;
         tableHtml +=`<td>${age}</td>`;
         tableHtml +=`<td>${salary}</td>`;
         tableHtml +=`<td>${new Date(registerday).toDateString()}</td>`;
         tableHtml +=`<td>${signintime ? new Date(signintime).toLocaleString() : 'Never Signed In'}</td>`;
         tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}



