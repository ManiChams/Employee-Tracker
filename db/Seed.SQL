-- Insert initial data into departments table
INSERT INTO departments (name) VALUES
('Engineering'),
('Human Resources'),
('Marketing'),
('Sales'),
('Finance');

-- Insert initial data into roles table
INSERT INTO roles (title, salary, department_id) VALUES
('Software Engineer', 80000, (SELECT id FROM departments WHERE name = 'Engineering')),
('HR Manager', 60000, (SELECT id FROM departments WHERE name = 'Human Resources')),
('Marketing Specialist', 50000, (SELECT id FROM departments WHERE name = 'Marketing')),
('Sales Representative', 45000, (SELECT id FROM departments WHERE name = 'Sales')),
('Financial Analyst', 70000, (SELECT id FROM departments WHERE name = 'Finance'));

-- Insert initial data into employees table
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', (SELECT id FROM roles WHERE title = 'Software Engineer'), NULL),
('Jane', 'Smith', (SELECT id FROM roles WHERE title = 'HR Manager'), NULL),
('Emily', 'Jones', (SELECT id FROM roles WHERE title = 'Marketing Specialist'), NULL),
('Michael', 'Brown', (SELECT id FROM roles WHERE title = 'Sales Representative'), NULL),
('Sarah', 'Davis', (SELECT id FROM roles WHERE title = 'Financial Analyst'), NULL);