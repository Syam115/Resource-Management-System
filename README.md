# Smart Resource and Space Management System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.1-brightgreen.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-blue.svg)

An enterprise-grade, full-stack web application designed for comprehensive resource and space management. This system provides a robust platform for managing organizational resources, categories, user bookings, and administrative tasks with advanced role-based access control (RBAC).

## 🚀 Features

- **Role-Based Access Control (RBAC):** Distinct roles for Users and Servicers/Admins, ensuring secure and localized data access.
- **Resource Repository:** Manage workspaces, equipment, or any allocatable asset seamlessly.
- **Dynamic Categories:** Classify resources structurally under scalable resource categories.
- **Booking Engine:** Real-time booking management, scheduling, and conflict resolution mechanisms.
- **Stateful Lifecycle Management:** End-to-end tracking of booking states (Pending, Confirmed, Cancelled, Completed).
- **Secure Authentication:** JWT-based stateless authentication integrated with Spring Security context.
- **Responsive Web Interface:** Modern, mobile-first UI developed with React and Tailwind CSS.

## 🛠 Technology Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.1** (Web, Data JPA, Security, Validation)
- **Spring Security** (Custom JWT filters & stateless session management)
- **PostgreSQL** (Relational Database)
- **Lombok** (Boilerplate reduction)
- **Maven** (Dependency Management)

### Frontend
- **React.js 18.2.0**
- **Tailwind CSS** (Utility-first styling framework)
- **React Router DOM** (Client-side routing)
- **Axios** (Promise-based HTTP client for API interactions)

## 🏗 System Architecture

The application adopts a decoupled client-server architecture:
1. **Frontend:** Single Page Application (SPA) consuming RESTful APIs.
2. **Backend:** Monolithic REST API utilizing the Layered Architecture pattern (Controller -> Service -> Repository / Data Access).
3. **Database:** PostgreSQL handling persistent storage with Spring Data JPA (Hibernate) managing ORM mappings.

## 🚦 Getting Started

Follow these instructions to set up the project locally for development and testing.

### Prerequisites
- [Java Development Kit (JDK) 17](https://jdk.java.net/17/)
- [Node.js (v16+)](https://nodejs.org/en/) & npm
- [PostgreSQL (v14+)](https://www.postgresql.org/download/)
- [Maven](https://maven.apache.org/)

### 1. Database Configuration
Create a PostgreSQL database for the application.

```sql
CREATE DATABASE resource_management_db;
```

### 2. Backend Setup

1. Navigate to the `backend` directory.
   ```bash
   cd backend
   ```
2. Configure the environment variables. Locate or create your `application.properties` or `application.yml` in `backend/src/main/resources/` and set proper database credentials and JWT properties:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/resource_management_db
   spring.datasource.username=YOUR_PG_USERNAME
   spring.datasource.password=YOUR_PG_PASSWORD
   
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true

   # JWT Security Key (Use a strong base64 encoded sequence)
   jwt.secret=YOUR_SUPER_SECRET_JWT_KEY
   jwt.expiration=86400000
   ```
3. Run the application using Maven Wrapper or local Maven installation.
   ```bash
   mvn spring-boot:run
   ```
   The backend API will run by default on `http://localhost:8080`.

### 3. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory.
   ```bash
   cd frontend
   ```
2. Install the dependencies.
   ```bash
   npm install
   ```
3. *(Optional)* Configure the API base URL. Ensure you have a `.env` file or properly set Axios base paths targeting the backend (e.g., `http://localhost:8080/api`).
4. Start the React development server.
   ```bash
   npm start
   ```
   The application will be accessible at `http://localhost:3000`.

## 📂 Core Entity Relationship

- **User [1] -> [0..*] Booking:** A user can have multiple resource bookings.
- **ResourceCategory [1] -> [0..*] Resource:** Hierarchical classification of resources.
- **Resource [1] -> [0..*] Booking:** A single resource can be subject to multiple bookings over time.

## 🛡 Security & Authentication

All private API routes are secured via JWT. Upon successful `/auth/login`, the API returns a Bearer Token. The frontend includes this token in the `Authorization` header (`Bearer <token>`) via Axios interceptors.

## 🤝 Contribution Guidelines

1. **Format Code:** Ensure clean code principles and follow standard Java and ES6+ conventions.
2. **Commit Messages:** Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.
3. **Branching Strategy:** Use feature branches (`feature/your-feature`) and open Pull Requests against the `main` branch.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
