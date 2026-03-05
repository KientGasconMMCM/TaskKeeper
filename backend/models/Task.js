const { getDatabase, saveDatabase } = require('./db');

const Task = {
  create: async (userId, taskName, taskDescription, deadline) => {
    const db = await getDatabase();
    db.run('INSERT INTO tasks (user_id, task_name, task_description, deadline) VALUES (?, ?, ?, ?)', [userId, taskName, taskDescription, deadline]);
    const result = db.exec('SELECT last_insert_rowid() as id');
    const id = result[0].values[0][0];
    saveDatabase();
    return { id, userId, taskName, taskDescription, deadline };
  },

  getByUserId: async (userId) => {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY deadline');
    stmt.bind([userId]);
    const tasks = [];
    while (stmt.step()) {
      tasks.push(stmt.getAsObject());
    }
    stmt.free();
    return tasks;
  },

  update: async (taskId, taskName, taskDescription, deadline, status) => {
    const db = await getDatabase();
    db.run('UPDATE tasks SET task_name = ?, task_description = ?, deadline = ?, status = ? WHERE id = ?', [taskName, taskDescription, deadline, status, taskId]);
    saveDatabase();
  },

  delete: async (taskId) => {
    const db = await getDatabase();
    db.run('DELETE FROM tasks WHERE id = ?', [taskId]);
    saveDatabase();
  }
};

module.exports = Task;
