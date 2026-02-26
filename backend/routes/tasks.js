const express = require('express');
const authMiddleware = require('../middleware/auth');
const Task = require('../models/Task');

const router = express.Router();

// Create task
router.post('/', authMiddleware, (req, res) => {
  const { taskName, taskDescription, deadline } = req.body;
  const userId = req.userId;

  if (!taskName) {
    return res.status(400).json({ message: 'Task name is required' });
  }

  Task.create(userId, taskName, taskDescription, deadline, (err, task) => {
    if (err) {
      return res.status(500).json({ message: 'Error creating task' });
    }

    res.json({ message: 'Task created successfully', task });
  });
});

// Get all tasks for user
router.get('/', authMiddleware, (req, res) => {
  const userId = req.userId;

  Task.getByUserId(userId, (err, tasks) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching tasks' });
    }

    res.json({ tasks });
  });
});

// Update task
router.put('/:id', authMiddleware, (req, res) => {
  const { taskName, taskDescription, deadline, status } = req.body;
  const taskId = req.params.id;

  if (!taskName) {
    return res.status(400).json({ message: 'Task name is required' });
  }

  Task.update(taskId, taskName, taskDescription, deadline, status, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error updating task' });
    }

    res.json({ message: 'Task updated successfully' });
  });
});

// Delete task
router.delete('/:id', authMiddleware, (req, res) => {
  const taskId = req.params.id;

  Task.delete(taskId, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting task' });
    }

    res.json({ message: 'Task deleted successfully' });
  });
});

module.exports = router;
