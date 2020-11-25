const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const colors = require("colors");

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
        choices: ["Add", "View", "Update", "Delete", "All Done"],
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
        choices: ["View Departments", "View Roles", "View Employees", "View Employees by Manager ID"],
        when: (data) => data.userRoute === "View",
      },
      {
        type: "list",
        name: "userSelection",
        message: "Who or what would you like to delete?",
        choices: ["Delete Department", "Delete Role", "Delete Employee"],
        when: (data) => data.userRoute === "Delete",
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
          case "View Employees by Manager ID":
            viewEmployeesByManager();
            break;
        case "Update":
          updateEmployee();
          break;
          case "Delete Department":
          deleteDepartment();
          break;
          case "Delete Role":
          deleteRole();
          break;
          case "Delete Employee":
          deleteEmployee();
          break;
        case "All Done":
            console.log("Database has been updated.".green);
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
        validate: (data) => {
            const number = data.match(/^[1-9]\d*$/);
            if (data === ""){
                return "Please enter the department you would like to add".brightRed;
            } 
                return true; 
        },
      },
    ])
    .then((data) => {
      console.log(`Department: ${data.newDepartment}`.green);
      verifyDepartment(data.newDepartment);
    });
};

const verifyDepartment = (newDep) => {
    inquirer.prompt([
        {
            type:'confirm',
            name: "depCheck",
            message: "Is the above information correct?"
        }
    ]).then((data) => {
        if (data.depCheck === true) {
            // add department to employee_DB
            connection.query("INSERT INTO department (name) VALUES (?)", [newDep], (err,res) => {
                if (err) throw err;
                // console.log(`"${newDep}" department has been added.`);
            });
            connection.query("SELECT * FROM department WHERE name=?", [newDep], (err,res) => {
                if (err) throw err;
                console.log(`"${newDep}" department has been added.`.green);
                console.table(res);
                addAnotherDepartment();
            });
            // console.log(`"${newDep}" department has been added.`);
            // addAnotherDepartment();
          } else {
            console.log("No worries! Please try again.");
            addDepartment();
          }
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
        validate: (data) => {
            if (data === ""){
                return "Please enter the title of the role".brightRed;
            } 
                return true; 
        },
      },
      {
        type: "input",
        name: "roleSalary",
        message: "What is the salary of this role?(DO NOT USE COMMAS)",
        validate: (data) => {
            if (data.indexOf(',') > -1) {
                return "Please do not use commas.".brightRed;
            } else if (data === ""){
                return "Please enter a salary.".brightRed;
            } else if (isNaN(data)){
                return "Please enter a number value.".brightRed;
            }
            return true;
        },
      },
      {
        type: "input",
        name: "newDepId",
        message: "What is the department ID that this role is associated with?",
        validate: (data) => {
            if (data.indexOf(',') > -1) {
                return "Please do not use commas.".brightRed;
            } else if (data === ""){
                return "Please enter an ID.".brightRed;
            } else if (isNaN(data)){
                return "Please enter a number value.".brightRed;
            }
            return true;
        },
      },
    ])
    .then((data) => {
      console.log(
        `Role: ${data.newRole}\nSalary: ${data.roleSalary}\nAssociated Department ID: ${data.newDepId}`.green
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
        connection.query("INSERT INTO role (title, salary, department_id) VALUES (?,?,?)", [role, salary, depId], (err,res) => {
            if (err) throw err;
        });
        connection.query("SELECT * FROM role WHERE title=?", [role], (err,res) => {
            if (err) throw err;
            console.log(`"${role}" role has been added.`.green);
            console.table(res);
            addAnotherRole();
        });
      } else {
        console.log("No worries! Please try again.".blue);
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
        validate: (data) => {
            const number = data.match(/^[1-9]\d*$/);
            if (data === "" || data == number){
                return "Please enter a first name".brightRed;
            } 
                return true; 
        },
      },
      {
        type: "input",
        name: "lastName",
        message: "What is this employees last name?",
        validate: (data) => {
            const number = data.match(/^[1-9]\d*$/);
            if (data === "" || data == number){
                return "Please enter a last name".brightRed;
            } 
                return true; 
        },
      },
      {
        type: "input",
        name: "roleId",
        message: "What is this employees Role ID?",
        validate: (data) => {
            const number = data.match(/^[1-9]\d*$/);
            if (data === "" || data != number){
                return "Please enter a role ID".brightRed;
            } 
                return true; 
        },
      },
      {
        type: "input",
        name: "managerId",
        message: "What manager ID is this employee associated with?",
        validate: (data) => {
            const number = data.match(/^[1-9]\d*$/);
            if (data === "" || data != number){
                return "Please enter manager ID, if they have no manager please put '0'".brightRed;
            } 
                return true; 
        },
      },
    ])
    .then((data) => {
      // add validation incase role_id already exists, don't add data, repeat prompts.
      console.log(
        `First Name: ${data.firstName}\nLast Name: ${data.lastName}\nRole ID: ${data.roleId}\nAssociated Manager ID: ${data.managerId}`.green
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
            // add role to employee_DB
            connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)", [first, last, roleId, managerId], (err,res) => {
                if (err) throw err;
                console.log(`"${first} ${last}" has been added. \n Employee ID#: ${res.insertId}.`.green);
                addAnotherEmployee();
            });
          } else {
            console.log("No worries! Please try again.".blue);
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

const viewEmployeesByManager = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "employeesWithManager",
            message: "Please enter the Manager ID# of the employees you would like to see.",
            validate: (data) => {
                const number = data.match(/^[1-9]\d*$/);
                if (data === "" || data != number){
                    return "Please enter the ID".brightRed;
                } 
                    return true; 
            },
        }
    ]).then((data) => {
        connection.query("SELECT * FROM employee where manager_id = ?", [data.employeesWithManager], (err,res) => {
            if (err) throw err;
            console.table(res);
            employeeTracker();
        });
    });
    
};

const updateEmployee = () => {
   connection.query("SELECT * FROM employee", (err, res) => {
       if (err) throw err;
       let employeeNames = res.map((el) => {
           return el;
       });
       let employeeIDs = res.map((el) => {
        return el.employee_id;
       });
        console.table(res);
        console.log("Please use the above table to find the corresponding employee by their ID".green)
       inquirer.prompt([
           {
               type: "list",
               name: "selectEmployee",
               message: "Which employee would you like to update?",
               choices: employeeIDs
           },
           {
               type: "list",
               name: "updateChoice",
               message: 'What would you like to update?',
               choices: ['Role ID', 'Manager ID']
           }
       ]).then((data) => {
           let empId = data.selectEmployee;
           if(data.updateChoice === "Role ID") {
            connection.query("SELECT * FROM employee WHERE employee_id = ?", [empId], (err,res) => {
                if (err) throw err;
                console.log("Current employee information".green)
                console.table(res);
            });
            connection.query("SELECT * FROM role", (err, res) => {
                if (err) throw err;
                console.log("Current Roles in the system.".green);
                console.table(res);
                updateEmployeeRoleId(empId);
            })
           } else {
            connection.query("SELECT * FROM employee WHERE employee_id = ?", [empId], (err,res) => {
                if (err) throw err;
                console.log("Current employee information".green)
                console.table(res);
                updateEmployeeManagerId(empId);
            });
           }
       });
   });
   
}

const updateEmployeeRoleId = (empId) => {
    
        inquirer.prompt([
            {
                type:'input',
                name: "newRoleId",
                message: 'What new Role ID would you like to assign?',
                validate: (data) => {
                    const number = data.match(/^[1-9]\d*$/);
                    if (data === "" || data != number){
                        return "Please enter new Role ID".brightRed;
                    } 
                        return true; 
                },
            }
        ]).then((data) => {
            connection.query("UPDATE employee SET role_id = ? WHERE employee_id = ?", [data.newRoleId, empId], (err, res) => {
                if (err) throw err;
            });
            connection.query("SELECT * FROM employee WHERE employee_id = ?", [empId], (err,res) => {
                if (err) throw err;
                console.log("Updated employee information".green);
                console.table(res);
                updateAgain();      
    });
})};

const updateEmployeeManagerId = (empId) => {
    inquirer.prompt([
        {
            type:'input',
            name: "newManagerId",
            message: 'What new Manager ID would you like to assign?',
            validate: (data) => {
                const number = data.match(/^[1-9]\d*$/);
                if (data === "" || data != number){
                    return "Please enter new Manager ID".brightRed;
                } 
                    return true; 
            },
        }
    ]).then((data) => {
        connection.query("UPDATE employee SET manager_id = ? WHERE employee_id = ?", [data.newManagerId, empId], (err, res) => {
            if (err) throw err;
        });
        connection.query("SELECT * FROM employee WHERE employee_id = ?", [empId], (err,res) => {
            if (err) throw err;
            console.log("Updated employee information".green);
            console.table(res);
            updateAgain();      
});
});
};

const updateAgain = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: "updateAgain",
            message: "What would you like to do?",
            choices: ["Update another employee", "Back to the main menu", "All Done"]
        }
    ]).then((data) => {
        if(data.updateAgain === "Update another employee") {
            updateEmployee();
        } else if (data.updateAgain === "Back to the main menu") {
            employeeTracker();
        } else {
            console.log("Database has been updated.".green)
            connection.end();
            return;  
        }
    })
};

const deleteDepartment = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        if (res.length < 1) {
            console.log("There are no departments to delete.".green);
            employeeTracker();
        } else {
        console.log("These are the current departments.".green);
        console.table(res);
        let departmentsArray = res.map((el) => {
            return el.name;
        });
        inquirer.prompt([
            {
                type: 'list',
                name: 'departmentName',
                message: "Which department would you like to delete?",
                choices: departmentsArray
            }
        ]).then((data) => {
            connection.query("DELETE FROM department WHERE name= ?", [data.departmentName], (err, res) => {
                if (err) throw err;
                console.log(`${data.departmentName} has been deleted`.green);
                employeeTracker();
            });
        });
    }});
    
}

const deleteRole = () => {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        if (res.length < 1){
            console.log("There are no roles to delete.".green);
            employeeTracker();
        } else {
        console.log("These are the current roles.".green);
        console.table(res);
        let rolesArray = res.map((el) => {
            return el.title;
        });
        inquirer.prompt([
            {
                type: 'list',
                name: 'roleTitle',
                message: "Which department would you like to delete?",
                choices: rolesArray
            }
        ]).then((data) => {
            connection.query("DELETE FROM role WHERE title= ?", [data.roleTitle], (err, res) => {
                if (err) throw err;
                console.log(`${data.roleTitle} has been deleted`.green);
                employeeTracker();
            });
        });
    }});
    
}

const deleteEmployee = () => {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        if (res.length < 1){
            console.log("There are no employees to delete.".green);
            employeeTracker();
        } else {
        console.log("These are the current employees.".green);
        console.table(res);
        let employeesArray = res.map((el) => {
            return el.employee_id;
        });
        console.log("Please use the above table to find the corresponding employee.".green)
        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: "Which employee would you like to delete?",
                choices: employeesArray
            }
        ]).then((data) => {
            connection.query("DELETE FROM employee WHERE employee_id= ?", [data.employeeId], (err, res) => {
                if (err) throw err;
                console.log(`Employee with ID#: "${data.employeeId}" has been deleted.`.green);
                employeeTracker();
            });
        });
    }});
    
};


employeeTracker();
