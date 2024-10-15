# Café Employee Manager - Frontend

This is a React-based frontend application for managing cafés and employees. It provides functionalities for adding, editing, deleting, and viewing cafés and employees. The application is built with **React**, **Tanstack Query**, **React Router**, and **Material-UI**, and it is Dockerized for easy deployment.

## Features

- List, add, edit, and delete cafés and employees.
- Form validation for adding/editing employees and cafés.
- Responsive UI using **Material-UI**.
- Integrated with **Tanstack Query** for fetching and caching data from the backend API.
- Dockerized for easy deployment and development.
- Configurable API endpoints using a dedicated configuration file (config.ts).

## Tech Stack

- **React**: Frontend JavaScript library.
- **Tanstack Query**: For data fetching, caching, and state management.
- **React Router**: For navigation between different pages.
- **Material-UI**: For UI components and styling.
- **AgGrid**: For displaying data tables.
- **Docker**: For containerization and deployment.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/) (version 18 or higher recommended)
- [Docker](https://www.docker.com/get-started)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Configuration

To allow for easy changes to API endpoints, the project uses a configuration file (src/config.ts). You can update API base URLs and endpoints within this file without needing to modify each service directly.

### Example src/config.ts:

```typescript
const API_ENDPOINTS = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8800",
  CAFES: "/api/cafes",
  CAFE: "/api/cafe",
  EMPLOYEES: "/api/employees",
  EMPLOYEE: "/api/employee",
};

export default API_ENDPOINTS;
```

You can change the BASE_URL and other endpoints by setting the REACT_APP_API_BASE_URL environment variable.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/YQWOH/cafe-employee.git
   cd cafe-employee/client
   ```

2. **Install dependencies and start development server**:

   ```bash
   npm install
   npm start
   ```

3. **To run in docker**:

- Build the Docker image and Run the Docker container:

  ```bash
   docker build -t cafe-employee-manager-frontend .
   docker run -p 3000:80 cafe-employee-manager-frontend
  ```

4. **If you want to run the app using Docker Compose:**:

- Create a docker-compose.yml (if not already present):

  ```yaml
  version: "3"
  services:
    frontend:
      build:
        context: .
        dockerfile: Dockerfile
      ports:
        - "3000:80"
  ```

- Run the app using Docker Compose:

  ```bash
   docker-compose up --build
  ```

5. **Available Scripts**:
   In the project directory, you can run

- npm start

  Runs the app in development mode. Open http://localhost:3000 to view it in the browser.

- npm run build

  Builds the app for production in the build folder. It optimizes the build for best performance.
