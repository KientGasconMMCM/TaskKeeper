const { getDatabase } = require('./db');

const Task = {
  create: async (userId, taskName, taskDescription, deadline, priority, category) => {
    const sql = await getDatabase();
    const p = priority || 'medium';
    const d = deadline || null;
    const c = category || null;
    const rows = await sql(
      'INSERT INTO tasks (user_id, task_name, task_description, deadline, priority, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [userId, taskName, taskDescription || null, d, p, c]
    );
    const id = rows[0].id;
    return { id, userId, taskName, taskDescription, deadline, priority: p, category: c };
  },

  getByUserId: async (userId) => {
    const sql = await getDatabase();
    return await sql('SELECT * FROM tasks WHERE user_id = $1 ORDER BY deadline', [userId]);
  },

  update: async (taskId, taskName, taskDescription, deadline, status, priority, category) => {
    const sql = await getDatabase();
    const p = priority || 'medium';
    const d = deadline || null;
    const c = category || null;
    await sql(
      'UPDATE tasks SET task_name = $1, task_description = $2, deadline = $3, status = $4, priority = $5, category = $6 WHERE id = $7',
      [taskName, taskDescription || null, d, status, p, c, taskId]
    );
  },

  delete: async (taskId) => {
    const sql = await getDatabase();
    await sql('DELETE FROM tasks WHERE id = $1', [taskId]);
  }
};

module.exports = Task;
