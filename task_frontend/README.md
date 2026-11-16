# Task Management System

A full-stack Task Management System built using **Java, Spring Boot, React.js, and MySQL**. The application allows administrators to manage employees and tasks, assign tasks to employees, and monitor task progress. Employees can view their assigned tasks, update task statuses, and track their work summary.

## Features

### Admin
- Admin login and logout
- Create, view, update, and delete employees
- Create, view, update, and delete tasks
- Assign tasks to employees
- Monitor all tasks
- Filter tasks by status
- View dashboard statistics

### Employee
- Employee login and logout
- View assigned tasks
- View individual task details
- Update task status
- View task summary
- Refresh task information

## Technologies Used

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Frontend tooling | Vite |
| API communication | Axios |
| Backend | Java, Spring Boot |
| Backend architecture | Controller, Service, Repository |
| Database | MySQL |
| API testing | Postman |

## Application Architecture

The application follows a frontend-backend architecture.

- **React.js:** Provides the user interface for administrators and employees.
- **Spring Boot:** Handles business logic and REST API requests.
- **MySQL:** Stores employee and task information.
- **Axios:** Connects the React frontend to the Spring Boot backend.

## Database Design

The application uses two primary tables:

### Employees
Stores employee information:
- id
- name
- email
- password
- role

### Tasks
Stores task information:
- id
- title
- description
- status
- priority
- dueDate
- employee_id

### Relationship

One employee can have multiple tasks. Each task can be assigned to an employee through the `employee_id` foreign key.

## Task Status

Tasks support three statuses:

- `PENDING`
- `IN_PROGRESS`
- `COMPLETED`

## Task Priority

Tasks support three priority levels:

- `LOW`
- `MEDIUM`
- `HIGH`

## REST API Endpoints

All backend endpoints use the base URL:

`http://localhost:8080`

### Employee APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/employees` | Create employee |
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/{id}` | Get employee by ID |
| PUT | `/api/employees/{id}` | Update employee |
| DELETE | `/api/employees/{id}` | Delete employee |
| POST | `/api/employees/login` | Employee/Admin login |
| GET | `/api/employees/count` | Get employee count |

### Task APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/{id}` | Get task by ID |
| PUT | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Delete task |
| PUT | `/api/tasks/{taskId}/assign/{employeeId}` | Assign task |
| GET | `/api/tasks/employee/{employeeId}` | Get employee's tasks |
| PUT | `/api/tasks/{taskId}/status` | Update task status |
| GET | `/api/tasks/status/{status}` | Filter tasks by status |
| GET | `/api/tasks/status-summary` | Get overall task summary |
| GET | `/api/tasks/count` | Get total task count |
| GET | `/api/tasks/employee/{employeeId}/summary` | Get employee task summary |

## Installation and Setup

### Prerequisites

Install the following software:

- Java JDK
- Maven
- Node.js and npm
- MySQL Server
- MySQL Workbench (optional)
- Git (optional)

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate into the project folder:

```bash
cd task-management-system
```

### 2. Configure MySQL

Create the database:

```sql
CREATE DATABASE taskmanagement;
```

Configure the database connection in the backend's `application.properties` file.

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskmanagement
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Use your own local MySQL credentials. Do not commit real passwords or other secrets to GitHub.

### 3. Run the Backend

Open the backend project:

```bash
cd taskmanagement_backend
```

Run the Spring Boot application using Maven:

```bash
mvn spring-boot:run
```

Backend URL:

`http://localhost:8080`

### 4. Run the Frontend

Open another terminal:

```bash
cd taskmanagement_frontend
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

Frontend URL:

`http://localhost:5173`

## Testing

The application was tested using:

- Postman for backend REST API testing
- Browser testing for frontend functionality
- Employee creation, update, and deletion
- Task creation, update, deletion, and assignment
- Task status changes
- Admin dashboard statistics
- Employee task dashboard and summary
- End-to-end Admin and Employee workflows

## Future Enhancements

The following features are outside the scope of this learning project and may be added in a future version:

- Spring Security
- BCrypt password hashing
- JWT-based authentication
- Backend role-based authorization
- Improved security and deployment configuration
- Automated unit and integration tests

## Learning Outcomes

Through this project, I practiced:

- Building REST APIs with Spring Boot
- Implementing layered backend architecture
- Performing database operations using Spring Data JPA
- Managing MySQL relationships
- Implementing CRUD functionality
- Validating requests and handling exceptions
- Developing React components and pages
- Integrating frontend and backend using Axios
- Testing REST APIs and end-to-end application workflows

## Author

**Kollu Manikanta**

Full-Stack Development Learning Project

