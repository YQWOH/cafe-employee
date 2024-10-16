# Café Employee Manager API

This is a Node.js API for managing cafés and their employees, built with Express.js and MySQL. The API supports basic CRUD operations for cafés and employees.

## Features

- CRUD operations for cafés and employees.
- Association between cafés and employees.
- MySQL database for data storage.
- Dockerized setup with Docker Compose.
- Automatic waiting for MySQL service readiness using a custom wait-for-mysql.sh script

## Prerequisites

Make sure you have the following installed on your machine:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Setup Instructions

Follow these steps to get the project up and running using Docker.

### 1. Clone the Repository

```bash
git clone https://github.com/YQWOH/cafe-employee.git
cd cafe-employee/api
```

### 2. Set Up Environment Variables

No need to create .env files directly if you're using Docker Compose. The environment variables are already defined in docker-compose.yml.

However, for local development, you can use the following:

DB_HOST: MySQL service host (in Docker Compose, it's set to db).
DB_USER: MySQL root user (default is root).
DB_PASSWORD: Password for MySQL root user (set in docker-compose.yml or in src/config.ts).
DB_NAME: MySQL database name (cafe_manager).

Reminder: Update the password in the src/config.ts file for security purposes. The current default password is your_password. Ensure that you replace this password with a secure one before deploying the app:

```typescript
const config = {
  database: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "your_password",
    database: process.env.DB_NAME || "cafe_manager",
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
    waitForConnections: true,
    queueLimit: 0,
  },
};

export default config;
```

### 3. Dockerize the Application

You can easily spin up the API and MySQL database using Docker and Docker Compose.

Build and Start the Containers
Run the following command to build and start both the Node.js API and MySQL database containers:

```bash
docker-compose up --build
```

This will:

- Build the Docker image for the Node.js API.
- Pull and run the MySQL image.
- Automatically create the cafe_manager database if it doesn't exist.
- Seed the database with initial data (cafés and employees).
- Wait for the MySQL database to be ready before starting the API using the wait-for-mysql.sh script.

Access the API
Once the containers are running, the API will be accessible at: http://localhost:8800

Access the MySQL Database
You can connect to the MySQL database using a MySQL client. Use the following credentials:

Host: localhost
Port: 3306
Username: root
Password: as specified in docker-compose.yml or src/config.ts (replace your_password with the actual password).

Stopping the Containers
To stop the running containers, press CTRL + C in the terminal or run:

```bash
docker-compose down
```

### 4. Running the API Locally Without Docker

If you prefer to run the app locally without Docker, follow these steps:

Install Node.js and MySQL on your machine.

Set up the MySQL database locally and update the connection variables in src/db.ts.

Install dependencies:

```bash
npm install
```

Start the API:

```bash
npm run dev
```

The API will be available at http://localhost:8800.
