# Quick Start Guide

Follow these steps to get your Task Keeper application up and running.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Starting the Backend

1. Open a terminal/PowerShell and navigate to the backend folder:
```powershell
cd backend
```

2. Install dependencies:
```powershell
npm install
```

3. Start the backend server:
```powershell
npm run dev
```

You should see: "Server is running on port 5000"

## Starting the Frontend (in a new terminal)

1. Open a new terminal/PowerShell and navigate to the frontend folder:
```powershell
cd frontend
```

2. Install dependencies:
```powershell
npm install
```

3. Start the React development server:
```powershell
npm start
```

The application should automatically open in your browser at `http://localhost:3000`

## First Time Usage

1. **Sign Up**: Click "Create one" on the login page to register a new account
2. **Enter Details**: Provide username, email, and password
3. **Login**: Log in with your credentials
4. **Create Tasks**: Click the CREATE button to add new tasks
5. **Manage Tasks**: View, edit, or delete your tasks from the dashboard

## Common Issues

**"Port 5000 already in use"**
- Kill the process using port 5000, or change the PORT in backend/.env

**"npm command not found"**
- Make sure Node.js is installed: download from https://nodejs.org/

**Frontend won't connect to backend**
- Ensure backend is running on port 5000
- Check that the proxy in frontend/package.json is set to http://localhost:5000

## Project Layout

- `backend/` - Express.js API server
- `frontend/` - React web application
- `database.db` - SQLite database (created automatically)

Enjoy using Task Keeper!
