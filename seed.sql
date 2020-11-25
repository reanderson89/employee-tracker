DROP DATABASE IF EXISTS employee_DB;
CREATE DATABASE employee_DB;
USE employee_DB;



-- * **department**:
CREATE TABLE department (
department_id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255)
);
--   * **id** - INT PRIMARY KEY
--   * **name** - VARCHAR(30) to hold department name

-- * **role**:
CREATE TABLE role (
role_id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255),
salary DECIMAL(30,4),
department_id INT,
FOREIGN KEY (department_id) REFERENCES department (department_id) ON DELETE CASCADE
);
--   * **id** - INT PRIMARY KEY
--   * **title** -  VARCHAR(30) to hold role title
--   * **salary** -  DECIMAL to hold role salary
--   * **department_id** -  INT to hold reference to department role belongs to

-- * **employee**:
CREATE TABLE employee (
employee_id INT AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(255),
last_name VARCHAR(255),
role_id INT,
manager_id INT,
FOREIGN KEY (role_id) REFERENCES role (role_id) ON DELETE CASCADE
);
--   * **id** - INT PRIMARY KEY
--   * **first_name** - VARCHAR(30) to hold employee first name
--   * **last_name** - VARCHAR(30) to hold employee last name
--   * **role_id** - INT to hold reference to role employee has
--   * **manager_id** - INT to hold reference to another employee that manages the employee being Created. This field may be null if the employee has no manager




