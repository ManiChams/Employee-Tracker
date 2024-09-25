const inquirer = require('inquirer');
const { query, connectToDatabase } = require('./config/connection');

// Function to start the application
async function startApp() {
    await connectToDatabase();

    const options = {
        'View all departments': viewAllDepartments,
        'View all roles': viewAllRoles,
        'View all employees': viewAllEmployees,
        'Add a department': addDepartment,
        'Add a role': addRole,
        'Add an employee': addEmployee,
        'Update an employee role': updateEmployeeRole,
        'Exit': () => {
            console.log('Goodbye!');
            process.exit(0);
        }
    };

    inquirer
        .prompt([
            {
                type: 'list',
                name: 'option',
                message: 'What would you like to do?',
                choices: Object.keys(options)
            }
        ])
        .then((answers) => {
            options[answers.option]();
        });
}

// Function to view all departments
async function viewAllDepartments() {
    const res = await query('SELECT id, name FROM departments');
    console.table(res.rows);
    startApp();
}

// Function to view all roles
async function viewAllRoles() {
    const res = await query(`
        SELECT roles.id, roles.title, departments.name AS department, roles.salary
        FROM roles
        JOIN departments ON roles.department_id = departments.id
    `);
    console.table(res.rows);
    startApp();
}

// Function to view all employees
async function viewAllEmployees() {
    const res = await query(`
        SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, 
               CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employees
        JOIN roles ON employees.role_id = roles.id
        JOIN departments ON roles.department_id = departments.id
        LEFT JOIN employees AS manager ON employees.manager_id = manager.id
    `);
    console.table(res.rows);
    startApp();
}

// Function to add a department
async function addDepartment() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department:',
        },
    ]);
    await query('INSERT INTO departments (name) VALUES ($1)', [answers.name]);
    console.log('Department added successfully.');
    startApp();
}

// Function to add a role
async function addRole() {
    const departments = await query('SELECT * FROM departments');
    const departmentChoices = departments.rows.map(department => ({
        name: department.name,
        value: department.id,
    }));

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the role:',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary of the role:',
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Select the department for the role:',
            choices: departmentChoices,
        },
    ]);
    await query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [answers.title, answers.salary, answers.department_id]);
    console.log('Role added successfully.');
    startApp();
}

// Function to add an employee
async function addEmployee() {
    const roles = await query('SELECT * FROM roles');
    const roleChoices = roles.rows.map(role => ({
        name: role.title,
        value: role.id,
    }));

    const employees = await query('SELECT * FROM employees');
    const managerChoices = employees.rows.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
    }));
    managerChoices.unshift({ name: 'None', value: null });

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the first name of the employee:',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the last name of the employee:',
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the role for the employee:',
            choices: roleChoices,
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Select the manager for the employee:',
            choices: managerChoices,
        },
    ]);
    await query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]);
    console.log('Employee added successfully.');
    startApp();
}

// Function to update an employee role
async function updateEmployeeRole() {
    const employees = await query('SELECT * FROM employees');
    const employeeChoices = employees.rows.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
    }));

    const roles = await query('SELECT * FROM roles');
    const roleChoices = roles.rows.map(role => ({
        name: role.title,
        value: role.id,
    }));

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Select the employee to update:',
            choices: employeeChoices,
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the new role for the employee:',
            choices: roleChoices,
        },
    ]);
    await query('UPDATE employees SET role_id = $1 WHERE id = $2', [answers.role_id, answers.employee_id]);
    console.log('Employee role updated successfully.');
    startApp();
}

startApp();