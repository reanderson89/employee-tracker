const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port
  port: 3306,

  user: "root",

  password: "NewPassword20",
  database: "employee_DB",
});

//   Build a command-line application that at a minimum allows the user to:

//   * Add departments, roles, employees

//   * View departments, roles, employees

//   * Update employee roles

const employeeTracker = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "userRoute",
        message: "What would you like to do?",
        choices: ["Add", "View", "Update", "All Done"],
      },
      {
        type: "list",
        name: "userSelection",
        message: "Who or what would you like to add?",
        choices: ["Add Departments", "Add Roles", "Add Employees"],
        when: (data) => data.userRoute === "Add",
      },
      {
        type: "list",
        name: "userSelection",
        message: "Who or what would you like to view?",
        choices: ["View Departments", "View Roles", "View Employees"],
        when: (data) => data.userRoute === "View",
      },
      {
        type: "list",
        name: "userSelection",
        message: "Who or what would you like to update?",
        choices: ["Update Departments", "Update Roles", "Update Employees"],
        when: (data) => data.userRoute === "Update",
      },
    ])
    .then((data) => {
      switch (data.userSelection || data.userRoute) {
        case "Add Departments":
          addDepartment();
          break;
        case "Add Roles":
          addRole();
          break;
        case "Add Employees":
          addEmployee();
          break;
        case "View Departments":
          viewDepartment();
          break;
        case "View Roles":
          viewRole();
          break;
        case "View Employees":
          viewEmployee();
          break;
        case "All Done":
            console.log("Database has been updated.")
          connection.end();
          return;
          break;

        default:
        // code block
      }
    });
};

// functions to add to DB
const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newDepartment",
        message: "What department would you like to add?",
      },
    ])
    .then((data) => {
      console.log(`"${data.newDepartment}" department has been added.`);
      addAnotherDepartment();
    });
};

const addAnotherDepartment = () => {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "anotherDepartment",
        message: "Would you like to add another department?",
      },
    ])
    .then((data) => {
      if (data.anotherDepartment === true) {
        addDepartment();
      } else {
        employeeTracker();
      }
    });
};

const addRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newRole",
        message: "What is the title of this role?",
      },
      {
        type: "input",
        name: "roleSalary",
        message: "What is the salary of this role?",
      },
      {
        type: "input",
        name: "newDepId",
        message: "What is the department ID that this role is associated with?",
      },
    ])
    .then((data) => {
      // add validation incase role_id already exists, don't add data, repeat prompts.
      console.log(
        `Role: ${data.newRole}\nSalary: ${data.roleSalary}\nAssociated Department ID: ${data.newDepId}`
      );
      verifyRole(data.newRole, data.roleSalary, data.newDepId);
    });
};

const verifyRole = (role, salary, depId) => {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "checkRole",
        message: "Is the above information correct?",
      },
    ])
    .then((data) => {
      if (data.checkRole === true) {
        // add role to employee_DB
        console.log(`"${role}" has been added.`);
        addAnotherRole();
      } else {
        console.log("No worries! Please try again.");
        addRole();
      }
    });
};

const addAnotherRole = () => {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "anotherRole",
        message: "Would you like to add another role?",
      },
    ])
    .then((data) => {
      if (data.anotherRole === true) {
        addRole();
      } else {
        employeeTracker();
      }
    });
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is this employees first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is this employees last name?",
      },
      {
        type: "input",
        name: "roleId",
        message: "What is this employees role ID?",
      },
      {
        type: "input",
        name: "managerId",
        message: "What manager ID is this employee associated with?",
      },
    ])
    .then((data) => {
      // add validation incase role_id already exists, don't add data, repeat prompts.
      console.log(
        `First Name: ${data.firstName}\nLast Name: ${data.lastName}\nRole ID: ${data.roleId}\nAssociated Manager ID: ${data.managerId}`
      );
      verifyEmployee(
        data.firstName,
        data.lastName,
        data.roleId,
        data.managerId
      );
    });
};

const verifyEmployee = (first, last, roleId, managerId) => {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "checkEmployee",
        message: "Is the above information correct?",
      },
    ])
    .then((data) => {
      if (data.checkEmployee === true) {
        // add employee to employee_DB
        console.log(`"${first} ${last}" has been added.`);
        addAnotherEmployee();
      } else {
        console.log("No worries! Please try again.");
        addEmployee();
      }
    });
};

const addAnotherEmployee = () => {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "anotherEmployee",
        message: "Would you like to add another employee?",
      },
    ])
    .then((data) => {
      if (data.anotherEmployee === true) {
        addEmployee();
      } else {
        employeeTracker();
      }
    });
};

const viewDepartment = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
    employeeTracker();
  });
};

const viewRole = () => {
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    console.table(res);
    employeeTracker();
  });
};

const viewEmployee = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    console.table(res);
    employeeTracker();
  });
};

employeeTracker();
