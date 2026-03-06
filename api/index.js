const path = require('path');
const express = require('express');
const cors = require('cors');

// Load .env file for local dev; on Vercel env vars are injected automatically
const envPath = path.join(__dirname, '../backend/.env');
try { require('dotenv').config({ path: envPath }); } catch (e) { /* dotenv optional */ }

const authRoutes = require('../backend/routes/auth');
const taskRoutes = require('../backend/routes/tasks');

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', env: process.env.NODE_ENV || 'development' });
});

// Export for Vercel serverless
module.exports = app;
