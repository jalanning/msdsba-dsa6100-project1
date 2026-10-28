## Set Up
1. Download and install XAMPP (https://www.apachefriends.org/).
2. Launch the XAMPP control panel by searching XAMPP in the search box.
3. Start the Apache Web server and the MySql database server by clicking their respective start buttons.
4. Click the Admin button on the MySql row to start the phpMyAdmin web interface to interact with MySql via GUI and SQL statements.
5. Create a database called web_app.
6. Execute all the CREATE TABLE  and INSERT INTO statements from the sql.txt file in the web app database that is present on the web interface. DO NOT EXECUTE NUMBERED STATEMENTS.
7. Install nodejs and npm from  (https://nodejs.org). 
8. Download all files from github repository by running ```git clone https://github.com/jalanning/msdsba-dsa6100-project1```
9. In the Backend directory, create a file named `.env` with the following filled out:
 - Note, depending on your xampp configuration, the port, db_user, and password may be different.
```
PORT=5050
DB_USER=root
PASSWORD=root
DATABASE=web_app
DP_PORT=3306
HOST=localhost
JWT_SECRET=your_jwt_secret_here
```
10. Open terminal and navigate to the project directory using the `cd` command. 
11. Install npm packages & start the backend server by running the following from within the project directory:
```
cd Backend
npm install
npm run start
```
12. Open the index.html in web browser to access website by right clicking on the file in your file explorer and selecting `Open With > Chrome` (or your browser of choice).