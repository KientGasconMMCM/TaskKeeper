const { getDatabase } = require('./db');

const Task = {
  create: (userId, taskName, taskDescription, deadline, callback) => {
    const db = getDatabase();
    const query = `INSERT INTO tasks (user_id, task_name, task_description, deadline) VALUES (?, ?, ?, ?)`;
    db.run(query, [userId, taskName, taskDescription, deadline], function(err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { id: this.lastID, userId, taskName, taskDescription, deadline });
      }
    });
  },

  getByUserId: (userId, callback) => {
    const db = getDatabase();
    const query = `SELECT * FROM tasks WHERE user_id = ? ORDER BY deadline`;
    db.all(query, [userId], (err, rows) => {
      callback(err, rows);
    });
  },

  update: (taskId, taskName, taskDescription, deadline, status, callback) => {
    const db = getDatabase();
    const query = `UPDATE tasks SET task_name = ?, task_description = ?, deadline = ?, status = ? WHERE id = ?`;
    db.run(query, [taskName, taskDescription, deadline, status, taskId], function(err) {
      callback(err);
    });
  },

  delete: (taskId, callback) => {
    const db = getDatabase();
    const query = `DELETE FROM tasks WHERE id = ?`;
    db.run(query, [taskId], function(err) {
      callback(err);
    });
  }
};

module.exports = Task;
