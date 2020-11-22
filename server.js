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

//   Build a command-line application that at a minimum allows the user to:

//   * Add departments, roles, employees

//   * View departments, roles, employees

//   * Update employee roles

const employeeTracker = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "userSelection",
            message: "What would you like to do?",
            choices: ["Add Department", "Add Role", "Add Employee", "All Done"]
        }
    ]).then((data) => {
        switch(data.userSelection) {
            case "Add Department":
              addDepartment();
              break;
              case "Add Role":
              addRole();
              break;
              case "Add Employee":
              addEmployee();
              break;
            case "All Done":
              connection.end();
              break;
              
            default:
              // code block
          }
    })
};

// functions to add to DB
const addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "newDepartment",
            message: "What department would you like to add?"
        }
    ]).then((data) => {
        console.log(`${data.newDepartment} department has been added.`)
        addAnotherDepartment();
    })
};

const addAnotherDepartment = () => {
    inquirer.prompt([
        {
            type: "confirm",
            name: "anotherDepartment",
            message: "Would you like to add another department?"
        }
    ]).then((data) => {
        if (data.anotherDepartment === true) {
            addDepartment();
        } else {
            employeeTracker();
        }
    })
};

const addRole = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "newRole",
            message: "What is the title of this role?"
        },
        {
            type: "input",
            name: "roleSalary",
            message: "What is the salary of this role?"
        },
        {
            type: "input",
            name: "newDepId",
            message: "What is the department ID that this role is associated with?"
        }

    ]).then((data) => {
        // add validation incase role_id already exists, don't add data, repeat prompts.
        console.log(`Role: ${data.newRole}\nSalary: ${data.roleSalary}\nAssociated Department ID: ${data.newDepId}`);
        verifyRole(data.newRole, data.roleSalary, data.newDepId);
    })
};

const verifyRole = (role, salary, depId) => {
    inquirer.prompt([
        {
            type: "confirm",
            name: "checkRole",
            message: "Is the above information correct?"
        }
    ]).then((data) => {
        if (data.checkRole === true){
            // add role to employee_DB
            console.log(`This is to check if the information has been passed successfully: ${role}, ${salary}, ${depId}`);
            console.log("Role has been added.");
            addAnotherRole();
        } else {
            console.log("No worries! Please try again.")
            addRole();
        }
    })
};

const addAnotherRole = () => {
    inquirer.prompt([
        {
            type: "confirm",
            name: "anotherRole",
            message: "Would you like to add another role?"
        }
    ]).then((data) => {
        if (data.anotherRole === true) {
            addRole();
        } else {
            employeeTracker();
        }
    })
};

const addEmployee = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is this employees first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is this employees last name?"
        },
        {
            type: "input",
            name: "roleId",
            message: "What is this employees role ID?"
        },
        {
            type: "input",
            name: "mangerId",
            message: "What manager ID is this employee associated with?"
        }

    ]).then
}



employeeTracker();