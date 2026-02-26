const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: require('path').join(__dirname, '../backend/.env') });
const authRoutes = require('../backend/routes/auth');
const taskRoutes = require('../backend/routes/tasks');
const { initializeDatabase } = require('../backend/models/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

module.exports = app;
