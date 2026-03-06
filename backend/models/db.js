const { createClient } = require('@libsql/client');

let db = null;
let initPromise = null;

const getDatabase = () => {
  if (db) return Promise.resolve(db);
  if (initPromise) return initPromise;

  initPromise = (async () => {
    // Use Turso cloud URL + auth token when available,
    // otherwise fall back to a local SQLite file for development
    const url = process.env.TURSO_DATABASE_URL || 'file:./database.db';
    const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

    if (!process.env.TURSO_DATABASE_URL && process.env.VERCEL) {
      // On Vercel the filesystem is read-only; SQLite file won't persist.
      // Use /tmp if we must fall back, but data will be lost between invocations.
      console.warn('WARNING: TURSO_DATABASE_URL not set. Using ephemeral /tmp SQLite on Vercel.');
    }

    const effectiveUrl = (!process.env.TURSO_DATABASE_URL && process.env.VERCEL)
      ? 'file:/tmp/database.db'
      : url;

    console.log('Connecting to database:', effectiveUrl.replace(/\/\/.*@/, '//***@'));

    const client = createClient({ url: effectiveUrl, authToken });

    // Create tables
    await client.execute(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await client.execute(`CREATE TABLE IF NOT EXISTS tasks (
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
    try { await client.execute("ALTER TABLE tasks ADD COLUMN priority TEXT DEFAULT 'medium'"); } catch(e) {}

    console.log('Database initialized successfully');
    db = client;
    return db;
  })();

  return initPromise;
};

// No-op: Turso persists automatically, kept for API compatibility
const saveDatabase = () => {};

module.exports = {
  getDatabase,
  saveDatabase
};
