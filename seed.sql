DROP DATABASE IF EXISTS employee_DB;
CREATE DATABASE employee_DB;
USE employee_DB;



-- * **department**:
CREATE TABLE department (
department_id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(30)
);
--   * **id** - INT PRIMARY KEY
--   * **name** - VARCHAR(30) to hold department name

-- * **role**:
CREATE TABLE role (
role_id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(30),
salary DECIMAL,
department_id INT
);
--   * **id** - INT PRIMARY KEY
--   * **title** -  VARCHAR(30) to hold role title
--   * **salary** -  DECIMAL to hold role salary
--   * **department_id** -  INT to hold reference to department role belongs to

-- * **employee**:
CREATE TABLE employee (
employee_id INT AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT,
manager_id INT
);
--   * **id** - INT PRIMARY KEY
--   * **first_name** - VARCHAR(30) to hold employee first name
--   * **last_name** - VARCHAR(30) to hold employee last name
--   * **role_id** - INT to hold reference to role employee has
--   * **manager_id** - INT to hold reference to another employee that manages the employee being Created. This field may be null if the employee has no manager

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Robert", "Anderson", 1, 4);

INSERT INTO role (title, salary, department_id)
VALUES ("Baker", 45.000, 5);

INSERT INTO department (name)
VALUES ("Morning Crew");

SELECT * FROM employee;
