const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Read SQL file
    const sqlPath = path.join(__dirname, 'init.sql');
    const sqlCommands = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute SQL commands
    await pool.query(sqlCommands);
    
    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase(); 