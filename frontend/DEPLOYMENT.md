# TaskKeeper Frontend - HTML Pages

This folder contains standalone HTML pages for TaskKeeper that are ready for deployment on Vercel.

## Pages Included

- **index.html** - Landing/home page with sign-in and sign-up options
- **login.html** - User login page
- **register.html** - User registration/signup page
- **dashboard.html** - Main dashboard showing all tasks
- **create-task.html** - Create new task page
- **forgot-password.html** - Password recovery page

## Features

✓ Responsive design - Works on desktop, tablet, and mobile
✓ Modern UI with gradient backgrounds
✓ Form validation
✓ Token-based authentication with localStorage
✓ Task filtering and management
✓ Ready for Vercel deployment

## Structure

```
frontend/
├── public/
│   ├── index.html              # Landing page
│   ├── login.html              # Login page
│   ├── register.html           # Registration page
│   ├── dashboard.html          # Task dashboard
│   ├── create-task.html        # Create task form
│   ├── forgot-password.html    # Password recovery
│   └── styles.css              # Global styles (optional)
├── package.json
└── vercel.json                 # Vercel configuration
```

## API Endpoints Expected

The frontend expects the following API endpoints to be available:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset

### Tasks
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update task status
- `DELETE /api/tasks/:id` - Delete a task

## Request Format

### Register/Login
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Create Task
```json
{
  "title": "Task title",
  "description": "Task description",
  "dueDate": "2024-12-31",
  "priority": "high|medium|low",
  "category": "Work"
}
```

## Response Format

### Auth Success
```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

### Tasks List
```json
[
  {
    "_id": "task_id",
    "title": "Task title",
    "description": "Task description",
    "dueDate": "2024-12-31",
    "priority": "high",
    "category": "Work",
    "status": "pending"
  }
]
```

## Deployment to Vercel

### Option 1: Deploy HTML directly
1. Push code to GitHub
2. Connect repository to Vercel
3. Set build command: (leave empty for static files)
4. Set output directory: `frontend/public`

### Option 2: Using Vercel CLI
```bash
cd frontend
npm install -g vercel
vercel
```

## Environment Variables

If using environment variables for API endpoints, create a `.env.local` file:

```
REACT_APP_API_URL=https://your-backend-api.com
```

## Notes

- All authentication tokens are stored in `localStorage` under the key `token`
- Forms include built-in validation and error handling
- Pages automatically redirect to login if no token is present
- API calls include Authorization header with Bearer token
- Responsive design with mobile-first approach

## Support

For issues or questions, check the backend API documentation to ensure it matches the expected endpoint format.
