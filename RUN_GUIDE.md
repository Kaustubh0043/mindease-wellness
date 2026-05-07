# MindEase Execution Guide

This guide provides step-by-step instructions to set up and run the MindEase project locally.

## Prerequisites
- **Java 17** or higher
- **Maven** (for backend)
- **Node.js** (for frontend)
- **MySQL Server**

---

## 1. Database Setup
1. Open your MySQL client (e.g., MySQL Workbench or CLI).
2. Create a new database named `mindease`:
   ```sql
   CREATE DATABASE mindease;
   ```
3. Ensure your MySQL credentials match the backend configuration in `backend/src/main/resources/application.properties`:
   - **Username**: `root`
   - **Password**: `root123`
   *(If your password is different, please update the `application.properties` file accordingly.)*

---

## 2. Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```powershell
   cd backend
   ```
2. Run the Spring Boot application:
   - **Option A (If you have Maven)**:
     ```powershell
     mvn spring-boot:run
     ```
   - **Option B (VS Code)**: Open `backend/src/main/java/com/mindease/app/MindEaseApplication.java` and click the **Run** button above the `main` method.
3. The backend will start on `http://localhost:8080` by default.

---

## 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```powershell
   cd frontend
   ```
2. Install the necessary dependencies:
   ```powershell
   npm install
   ```
3. Start the development server:
   ```powershell
   npm run dev
   ```
4. The frontend will typically be available at `http://localhost:5173`.

---

## Troubleshooting
- **Database Connection**: If the backend fails to start, verify that MySQL is running and that the `mindease` database exists.
- **Node Modules**: If the frontend has issues, try deleting `node_modules` and running `npm install` again.
- **Port Conflicts**: Ensure ports `8080` (Backend) and `5173` (Frontend) are not being used by other applications.
