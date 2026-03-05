const { getDatabase } = require('./db');
const bcrypt = require('bcryptjs');

const User = {
  create: async (username, email, password) => {
    const db = await getDatabase();
    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = await db.execute({
      sql: 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      args: [username, email, hashedPassword]
    });
    const id = Number(result.lastInsertRowid);
    return { id, username, email };
  },

  findByUsername: async (username) => {
    const db = await getDatabase();
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE username = ?',
      args: [username]
    });
    return result.rows.length > 0 ? result.rows[0] : null;
  },

  findByEmail: async (email) => {
    const db = await getDatabase();
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email]
    });
    return result.rows.length > 0 ? result.rows[0] : null;
  },

  findByUsernameOrEmail: async (identifier) => {
    const db = await getDatabase();
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE username = ? OR email = ?',
      args: [identifier, identifier]
    });
    return result.rows.length > 0 ? result.rows[0] : null;
  },

  findById: async (id) => {
    const db = await getDatabase();
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [id]
    });
    return result.rows.length > 0 ? result.rows[0] : null;
  },

  updatePassword: async (email, newPassword) => {
    const db = await getDatabase();
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await db.execute({
      sql: 'UPDATE users SET password = ? WHERE email = ?',
      args: [hashedPassword, email]
    });
  }
};

module.exports = User;
