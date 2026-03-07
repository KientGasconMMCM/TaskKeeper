const { neon } = require('@neondatabase/serverless');

let sql = null;

const getDatabase = () => {
  if (sql) return Promise.resolve(sql);

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set. Get one free at https://neon.tech');
  }

  sql = neon(connectionString);
  return Promise.resolve(sql);
};

const initDatabase = async () => {
  const sql = await getDatabase();

  await sql(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  await sql(`CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    task_name TEXT NOT NULL,
    task_description TEXT,
    deadline TIMESTAMP,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  // Add priority column if missing (existing databases)
  try {
    await sql(`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium'`);
  } catch(e) {}

  console.log('Database initialized successfully');
};

const saveDatabase = () => {};

module.exports = {
  getDatabase,
  initDatabase,
  saveDatabase
};
