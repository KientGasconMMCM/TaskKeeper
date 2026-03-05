const express = require('express');
const authMiddleware = require('../middleware/auth');
const Task = require('../models/Task');

const router = express.Router();

// Create task
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { taskName, taskDescription, deadline, priority } = req.body;
    const userId = req.userId;

    if (!taskName) {
      return res.status(400).json({ message: 'Task name is required' });
    }

    const task = await Task.create(userId, taskName, taskDescription, deadline, priority);
    res.json({ message: 'Task created successfully', task });
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Get all tasks for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const tasks = await Task.getByUserId(userId);
    res.json({ tasks });
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Update task
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { taskName, taskDescription, deadline, status, priority } = req.body;
    const taskId = req.params.id;

    if (!taskName) {
      return res.status(400).json({ message: 'Task name is required' });
    }

    await Task.update(taskId, taskName, taskDescription, deadline, status, priority);
    res.json({ message: 'Task updated successfully' });
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Delete task
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;
    await Task.delete(taskId);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

module.exports = router;
