const { createClient } = require('@libsql/client');

let db = null;

const getDatabase = () => {
  if (db) return Promise.resolve(db);

  // Use Turso cloud URL + auth token when available,
  // otherwise fall back to a local SQLite file for development
  const url = process.env.TURSO_DATABASE_URL || 'file:./database.db';
  const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

  db = createClient({ url, authToken });

  return (async () => {
    // Create tables
    await db.execute(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await db.execute(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      task_name TEXT NOT NULL,
      task_description TEXT,
      deadline DATETIME,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    // Add priority column if missing (existing databases)
    try { await db.execute("ALTER TABLE tasks ADD COLUMN priority TEXT DEFAULT 'medium'"); } catch(e) {}

    console.log('Database initialized successfully');
    return db;
  })();
};

// No-op: Turso persists automatically, kept for API compatibility
const saveDatabase = () => {};

module.exports = {
  getDatabase,
  saveDatabase
};
