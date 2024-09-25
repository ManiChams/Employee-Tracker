# Employee-Tracker

Employee-Tracker is a command-line application that manages a company's employee database using Node.js, Inquirer, and PostgreSQL. This application allows users to view, add, and update departments, roles, and employees in the database.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [Video Demo](https://drive.google.com/drive/folders/1_hlSG-F-nBRArO0Q-6uLRDpPYiWSOp0-?usp=drive_link)
- [License](#MIT)
- [Author](Kimani Chambliss)

## Installation

To get started with the Employee-Tracker application, follow these steps:

1. **Clone the repository**:
    ```sh
    git clone https://github.com/Manichams/employee-tracker.git
    cd employee-tracker
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Set up the PostgreSQL database**:
    - Ensure PostgreSQL is installed and running on your machine.
    - Create a database named `company_db`:
        ```sh
        psql -U postgres -h localhost
        CREATE DATABASE company_db;
        \q
        ```

4. **Create the necessary tables**:
    - Connect to the `company_db` database and create the tables:
        ```sh
        psql -U postgres -h localhost -d company_db
        -- Paste the following SQL commands into the psql terminal
        CREATE TABLE departments (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        );

        CREATE TABLE roles (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            salary DECIMAL NOT NULL,
            department_id INTEGER REFERENCES departments(id)
        );

        CREATE TABLE employees (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            role_id INTEGER REFERENCES roles(id),
            manager_id INTEGER REFERENCES employees(id)
        );
        \q
        ```

5. **Configure environment variables**:
   
   

## Usage

To start the Employee-Tracker application, run the following command:

```sh
node app.js
