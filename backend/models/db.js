const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

// Use /tmp on Vercel (serverless), otherwise use local path
const isVercel = process.env.VERCEL === '1';
const dbPath = isVercel
  ? '/tmp/database.db'
  : path.join(__dirname, '../database.db');

let db = null;
let initPromise = null;

const getDatabase = () => {
  if (db) return Promise.resolve(db);
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const SQL = await initSqlJs();

    try {
      if (fs.existsSync(dbPath)) {
        const buffer = fs.readFileSync(dbPath);
        db = new SQL.Database(buffer);
      } else {
        db = new SQL.Database();
      }
    } catch (err) {
      console.error('Error loading database file, creating new one:', err.message);
      db = new SQL.Database();
    }

    // Create tables
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS tasks (
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
    try { db.run('ALTER TABLE tasks ADD COLUMN priority TEXT DEFAULT \'medium\''); } catch(e) {}

    console.log('Database initialized successfully');
    return db;
  })();

  return initPromise;
};

const saveDatabase = () => {
  if (!db) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  } catch (err) {
    console.error('Error saving database:', err.message);
  }
};

module.exports = {
  getDatabase,
  saveDatabase
};
