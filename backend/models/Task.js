const { getDatabase } = require('./db');

const Task = {
  create: async (userId, taskName, taskDescription, deadline, priority) => {
    const sql = await getDatabase();
    const p = priority || 'medium';
    const d = deadline || null;
    const rows = await sql(
      'INSERT INTO tasks (user_id, task_name, task_description, deadline, priority) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [userId, taskName, taskDescription || null, d, p]
    );
    const id = rows[0].id;
    return { id, userId, taskName, taskDescription, deadline, priority: p };
  },

  getByUserId: async (userId) => {
    const sql = await getDatabase();
    return await sql('SELECT * FROM tasks WHERE user_id = $1 ORDER BY deadline', [userId]);
  },

  update: async (taskId, taskName, taskDescription, deadline, status, priority) => {
    const sql = await getDatabase();
    const p = priority || 'medium';
    const d = deadline || null;
    await sql(
      'UPDATE tasks SET task_name = $1, task_description = $2, deadline = $3, status = $4, priority = $5 WHERE id = $6',
      [taskName, taskDescription || null, d, status, p, taskId]
    );
  },

  delete: async (taskId) => {
    const sql = await getDatabase();
    await sql('DELETE FROM tasks WHERE id = $1', [taskId]);
  }
};

module.exports = Task;
