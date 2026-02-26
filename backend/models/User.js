const { getDatabase } = require('./db');
const bcrypt = require('bcryptjs');

const User = {
  create: (username, email, password, callback) => {
    const db = getDatabase();
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    db.run(query, [username, email, hashedPassword], function(err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { id: this.lastID, username, email });
      }
    });
  },

  findByUsername: (username, callback) => {
    const db = getDatabase();
    const query = `SELECT * FROM users WHERE username = ?`;
    db.get(query, [username], (err, row) => {
      callback(err, row);
    });
  },

  findByEmail: (email, callback) => {
    const db = getDatabase();
    const query = `SELECT * FROM users WHERE email = ?`;
    db.get(query, [email], (err, row) => {
      callback(err, row);
    });
  },

  findByUsernameOrEmail: (identifier, callback) => {
    const db = getDatabase();
    const query = `SELECT * FROM users WHERE username = ? OR email = ?`;
    db.get(query, [identifier, identifier], (err, row) => {
      callback(err, row);
    });
  },

  findById: (id, callback) => {
    const db = getDatabase();
    const query = `SELECT * FROM users WHERE id = ?`;
    db.get(query, [id], (err, row) => {
      callback(err, row);
    });
  },

  updatePassword: (email, newPassword, callback) => {
    const db = getDatabase();
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    const query = `UPDATE users SET password = ? WHERE email = ?`;
    db.run(query, [hashedPassword, email], function(err) {
      callback(err);
    });
  }
};

module.exports = User;
