# Task Keeper - Task Reminder Application

A full-stack web application for managing tasks and deadlines with user authentication.

## Features

- **User Authentication**
  - Sign up with username and email
  - Login with credentials
  - Forgot password functionality
  - JWT-based session management

- **Task Management**
  - Create tasks with name, description, and deadline
  - View all your tasks in a table format
  - Delete tasks
  - Automatic deadline sorting

- **Responsive Design**
  - Dark theme UI with modern styling
  - Mobile-friendly interface
  - Smooth animations and transitions

## Tech Stack

**Backend:**
- Node.js with Express.js
- SQLite3 database
- JWT for authentication
- Bcryptjs for password hashing

**Frontend:**
- React 18
- React Router for navigation
- Axios for API communication
- CSS3 for styling

## Project Structure

```
TaskKeeper/
├── backend/
│   ├── models/
│   │   ├── db.js - Database initialization
│   │   ├── User.js - User model
│   │   └── Task.js - Task model
│   ├── routes/
│   │   ├── auth.js - Authentication routes
│   │   └── tasks.js - Task routes
│   ├── middleware/
│   │   └── auth.js - JWT authentication middleware
│   ├── server.js - Main server file
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.js
│   │   │   ├── SignupPage.js
│   │   │   ├── ForgotPasswordPage.js
│   │   │   └── DashboardPage.js
│   │   ├── components/
│   │   │   ├── TaskTable.js
│   │   │   └── CreateTaskModal.js
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   ├── index.html
│   │   └── styles.css
│   └── package.json
├── .gitignore
└── README.md
```

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
copy .env.example .env
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset user password

### Tasks (Requires Authentication)
- `GET /api/tasks` - Get all tasks for the user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Usage

1. **Sign Up**: Create a new account with username and email
2. **Login**: Log in with your credentials
3. **Create Task**: Click the CREATE button and fill in the task details
4. **View Tasks**: See all your tasks in the MANAGE ASSIGNMENTS table
5. **Delete Task**: Click the Delete button to remove a task
6. **Logout**: Click the Logout button to sign out

## License

MIT License
