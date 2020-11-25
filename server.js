const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const colors = require("colors");
const { Console } = require("console");

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

const welcome = () => {
    console.log("Welcome to Employee Tracker! We have created a Managers Department,\nManagers Role, and an example Manager for you to start with. \nPlease feel free to update the 'Salary' for the manager role \nand view the different areas to get better acquainted with the application.".blue)
    console.log("When adding to the database it is recommended that you follow these steps...\n1: Create a Department first\n2: If that Department has a manager use the 'Add Manager' feature to add them\n3: Create the roles for that department using the 'Add Roles' feature\n4: Create the employees using the 'Add Employee' feature".green);
    employeeTracker();
};

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
        choices: ["Add Departments", "Add Roles", "Add Employees", "Add Managers"],
        when: (data) => data.userRoute === "Add",
      },
      {
        type: "list",
        name: "userSelection",
        message: "Who or what would you like to view?",
        choices: ["View Departments", "View Roles", "View Employees", "View Employees by Manager ID", "View Utilized Budget by Department"],
        when: (data) => data.userRoute === "View",
      },
      {
        type: "list",
        name: "userSelection",
        message: "Who or what would you like to update?",
        choices: ["Update Employee", "Update Salary by Role"],
        when: (data) => data.userRoute === "Update",
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
          case "Add Managers":
          addManager();
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
            case "View Utilized Budget by Department":
            viewDepartmentBudget();
            break;
        case "Update Employee":
          updateEmployee();
          break;
          case "Update Salary by Role":
          updateSalaryByRole();
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
    connection.query("SELECT * FROM department", (err,res) => {
        if (err) throw err;
    
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
        type: "list",
        name: "newDepId",
        message: "What department is this role apart of?",
        choices: res.map(dep => ({value: dep.department_id, name: dep.name}))
        // validate: (data) => {
        //     if (data.indexOf(',') > -1) {
        //         return "Please do not use commas.".brightRed;
        //     } else if (data === ""){
        //         return "Please enter an ID.".brightRed;
        //     } else if (isNaN(data)){
        //         return "Please enter a number value.".brightRed;
        //     }
        //     return true;
        // },
      },
    ])
    .then((data) => {
      console.log(
        `Role: ${data.newRole}\nSalary: ${data.roleSalary}\nAssociated Department ID: ${data.newDepId}`.green
      );
      verifyRole(data.newRole, data.roleSalary, data.newDepId);
    });
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
            console.log(`${role} role has been added.`.green)
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

const addManager = () => {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                name: "firstName",
                message: "What is their first name?",
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
                message: "What is their last name?",
                validate: (data) => {
                    const number = data.match(/^[1-9]\d*$/);
                    if (data === "" || data == number){
                        return "Please enter a last name".brightRed;
                    } 
                        return true; 
                },
              },
              {
                type: "list",
                name: "roleId",
                message: "What is their role?",
                choices: res.map(el => ({ value: el.role_id, name: el.title }))
            },
        ]).then((data) => {
            connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)", [data.firstName, data.lastName, data.role_id, 1], (err,res) => {
                if (err) throw err;
                console.log(`"${data.firstName} ${data.lastName}" has been added as a manager. \n Employee ID#: ${res.insertId} will be used to associate employees to them.`.green);
                employeeTracker();
            });
        });
    });
};

const addEmployee = () => {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        connection.query("SELECT * FROM employee WHERE manager_id = 1", (err, result) => {
            if (err) throw err;
        
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
        type: "list",
        name: "roleId",
        message: "What is this employees Role?",
        choices: res.map(el => ({ value: el.role_id, name: el.title }))
      },
      {
        type: "list",
        name: "managerId",
        message: "What manager is this employee associated with?",
        choices: result.map(el => ({value: el.employee_id, name: `${el.first_name} ${el.last_name}`}))
      },
    ])
    .then((data) => {
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
});
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
  connection.query("SELECT * FROM role INNER JOIN department ON role.department_id = department.department_id", (err, res) => {
    if (err) throw err;
    console.table(res);
    employeeTracker();
  });
};

const viewEmployee = () => {
  connection.query("SELECT * FROM employee INNER JOIN role ON employee.role_id = role.role_id", (err, res) => {
    if (err) throw err;
    console.table(res);
    employeeTracker();
  });
};

const viewEmployeesByManager = () => {
    connection.query("SELECT * FROM employee", (err,res) => {
        if (err) throw err;
    
    inquirer.prompt([
        {
            type: "list",
            name: "employeesWithManager",
            message: "Please choose the manager you would like to see the employees of.",
            choices: res.map(manager => ({ value: manager.employee_id, name: `${manager.first_name} ${manager.last_name}`}))
        }
    ]).then((data) => {
        connection.query("SELECT * FROM employee INNER JOIN role ON employee.role_id = role.role_id WHERE manager_id = ?", [data.employeesWithManager], (err,res) => {
            if (err) throw err;
            console.table(res);
            employeeTracker();
        });
    });
});
    
};

const viewDepartmentBudget = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.log("Current departments".green)
        console.table(res);
    let departmentsArray = res.map((el) => {
        return el.name;
    })
    inquirer.prompt([
        {
            type: "list",
            name: "departmentChosen",
            message: "Which department would you like to check?",
            choices: departmentsArray
        }
    ]).then((data) => {
        connection.query("SELECT salary FROM role INNER JOIN department ON department.department_id = role.department_id WHERE name = ?", [data.departmentChosen], (err, result) => {
            if (err) throw err;
            let usedBudget = result.map((el) => {
                return el.salary;
            });
            let displayUsedBudget = usedBudget.reduce((a,b) => a + b, 0);
            displayUsedBudget = "$" + displayUsedBudget.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            console.log(`The current utilized budget for this department is ${displayUsedBudget}.`.green);
            employeeTracker();
        });
    })
    
});
};

const updateEmployee = () => {
   connection.query("SELECT * FROM employee", (err, res) => {
       if (err) throw err;
       inquirer.prompt([
           {
               type: "list",
               name: "selectEmployee",
               message: "Which employee would you like to update?",
               choices: res.map(employee => ({ value: employee.employee_id, name: `${employee.first_name} ${employee.last_name}`}))
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
            connection.query("SELECT * FROM employee INNER JOIN role ON employee.role_id = role.role_id WHERE employee_id = ?", [empId], (err,res) => {
                if (err) throw err;
                console.log("Current employee information".green)
                console.table(res);
            });
            connection.query("SELECT * FROM role", (err, res) => {
                if (err) throw err;
                let roleChoices = res.map(role => ({ value: role.role_id, name: role.title }));
                updateEmployeeRoleId(empId, roleChoices);
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
   
};

const updateSalaryByRole = () => {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                name: "selectRole",
                message: "Which role would you like to update?",
                choices: res.map(el => ({ value: el.role_id, name: el.title}))
            },
            {
                type: "input",
                name: "updatedSalary",
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
        ]).then((data) => {
            connection.query("UPDATE role SET salary=? WHERE role_id=?",[data.updatedSalary, data.selectRole], (err,res) => {
                if (err) throw err;
                console.log("Salary has been updated.".green)
                employeeTracker();
            })
        });    
    });
    
 }

const updateEmployeeRoleId = (empId, roleChoices) => {
    
        inquirer.prompt([
            {
                type:'list',
                name: "newRoleId",
                message: 'What new Role ID would you like to assign?',
                choices: roleChoices
            }
        ]).then((data) => {
            connection.query("UPDATE employee SET role_id = ? WHERE employee_id = ?", [data.newRoleId, empId], (err, res) => {
                if (err) throw err;
            });
            connection.query("SELECT * FROM employee INNER JOIN role ON employee.role_id = role.role_id WHERE employee_id = ?", [empId], (err,res) => {
                if (err) throw err;
                console.log("Updated employee information".green);
                console.table(res);
                updateAgain();      
    });
})};

const updateEmployeeManagerId = (empId) => {
    connection.query("SELECT * FROM employee WHERE manager_id = 1", (err,res) => {

    
    inquirer.prompt([
        {
            type:'list',
            name: "newManagerId",
            message: 'What Manager would you like to assign?',
            choices: res.map(el => ({value: el.employee_id, name: `${el.first_name} ${el.last_name}`}))
        }
    ]).then((data) => {
        connection.query("UPDATE employee SET manager_id = ? WHERE employee_id = ?", [data.newManagerId, empId], (err, res) => {
            if (err) throw err;
        });
        connection.query("SELECT * FROM employee WHERE employee_id = ?", [empId], (err,res) => {
            if (err) throw err;
            console.log("Updated employee information".green);
            updateAgain();      
});
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
                choices: res.map(el => ({value: el.employee_id, name: `${el.first_name} ${el.last_name}`}))
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

welcome();
