const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Sign up
router.post('/signup', (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  User.findByUsername(username, (err, user) => {
    if (user) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    User.findByEmail(email, (err, existingUser) => {
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      User.create(username, email, password, (err, newUser) => {
        if (err) {
          return res.status(500).json({ message: 'Error creating user' });
        }

        const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET, {
          expiresIn: '7d'
        });

        res.json({ token, user: newUser });
      });
    });
  });
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  User.findByUsername(username, (err, user) => {
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  });
});

// Forgot password
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  User.findByEmail(email, (err, user) => {
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // In a real application, you would send a reset email here
    // For now, we'll just return a message
    res.json({ message: 'Password reset instructions sent to email', email });
  });
});

// Reset password
router.post('/reset-password', (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  User.updatePassword(email, newPassword, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating password' });
    }

    res.json({ message: 'Password reset successfully' });
  });
});

module.exports = router;
