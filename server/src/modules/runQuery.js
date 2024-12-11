const sqlite = require('sqlite');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

module.exports = async (query, values) => {
  if (!query) {
    return null;
  }
  values = values || [];

  // Ensure the database directory exists
  const dbDir = path.resolve(__dirname, '../database');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  try {
    const db = await sqlite.open({
      filename: path.join(dbDir, 'data.sqlite'),
      driver: sqlite3.Database
    });

    if (db) {
      return await db.all(query, values);
    } else {
      throw new Error('Database connection failed.');
    }
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } 
};