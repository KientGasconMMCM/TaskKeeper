const { getDatabase } = require('./db');

const Task = {
  create: async (userId, taskName, taskDescription, deadline, priority) => {
    const db = await getDatabase();
    const p = priority || 'medium';
    const result = await db.execute({
      sql: 'INSERT INTO tasks (user_id, task_name, task_description, deadline, priority) VALUES (?, ?, ?, ?, ?)',
      args: [userId, taskName, taskDescription, deadline, p]
    });
    const id = Number(result.lastInsertRowid);
    return { id, userId, taskName, taskDescription, deadline, priority: p };
  },

  getByUserId: async (userId) => {
    const db = await getDatabase();
    const result = await db.execute({
      sql: 'SELECT * FROM tasks WHERE user_id = ? ORDER BY deadline',
      args: [userId]
    });
    return result.rows;
  },

  update: async (taskId, taskName, taskDescription, deadline, status, priority) => {
    const db = await getDatabase();
    const p = priority || 'medium';
    await db.execute({
      sql: 'UPDATE tasks SET task_name = ?, task_description = ?, deadline = ?, status = ?, priority = ? WHERE id = ?',
      args: [taskName, taskDescription, deadline, status, p, taskId]
    });
  },

  delete: async (taskId) => {
    const db = await getDatabase();
    await db.execute({
      sql: 'DELETE FROM tasks WHERE id = ?',
      args: [taskId]
    });
  }
};

module.exports = Task;
