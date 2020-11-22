const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");


var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port
    port: 3306,
  
 
    user: "root",
  
 
    password: "NewPassword20",
    database: "employee_DB"
  });

  