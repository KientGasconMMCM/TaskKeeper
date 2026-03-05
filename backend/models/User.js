const { getDatabase, saveDatabase } = require('./db');
const bcrypt = require('bcryptjs');

const User = {
  create: async (username, email, password) => {
    const db = await getDatabase();
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
    const result = db.exec('SELECT last_insert_rowid() as id');
    const id = result[0].values[0][0];
    saveDatabase();
    return { id, username, email };
  },

  findByUsername: async (username) => {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    stmt.bind([username]);
    let user = null;
    if (stmt.step()) {
      user = stmt.getAsObject();
    }
    stmt.free();
    return user;
  },

  findByEmail: async (email) => {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    stmt.bind([email]);
    let user = null;
    if (stmt.step()) {
      user = stmt.getAsObject();
    }
    stmt.free();
    return user;
  },

  findByUsernameOrEmail: async (identifier) => {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?');
    stmt.bind([identifier, identifier]);
    let user = null;
    if (stmt.step()) {
      user = stmt.getAsObject();
    }
    stmt.free();
    return user;
  },

  findById: async (id) => {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    stmt.bind([id]);
    let user = null;
    if (stmt.step()) {
      user = stmt.getAsObject();
    }
    stmt.free();
    return user;
  },

  updatePassword: async (email, newPassword) => {
    const db = await getDatabase();
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    db.run('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
    saveDatabase();
  }
};

module.exports = User;
