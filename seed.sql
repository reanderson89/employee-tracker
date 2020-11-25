DROP DATABASE IF EXISTS employee_DB;
CREATE DATABASE employee_DB;
USE employee_DB;


CREATE TABLE department (
department_id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255)
);

CREATE TABLE role (
role_id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255),
salary DECIMAL(30,4),
department_id INT,
FOREIGN KEY (department_id) REFERENCES department (department_id) ON DELETE CASCADE
);

CREATE TABLE employee (
employee_id INT AUTO_INCREMENT PRIMARY KEY,
first_name VARCHAR(255),
last_name VARCHAR(255),
role_id INT,
manager_id INT,
FOREIGN KEY (role_id) REFERENCES role (role_id) ON DELETE CASCADE
);

INSERT INTO department (name) VALUES("Managers");
INSERT INTO role (title, salary, department_id) VALUES("Manager", 75000, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES("Rick", "Ross", 1, 1);






