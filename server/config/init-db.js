/**
 * Database initialization script
 * This script creates necessary tables if they don't exist
 */
const pool = require('./database');

const initDatabase = async () => {
  try {
    console.log('Initializing database tables...');

    // Create job_resources table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS job_resources (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        filters JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database tables:', error);
    return false;
  }
};

// Execute immediately if this script is run directly
if (require.main === module) {
  initDatabase()
    .then(success => {
      console.log(success ? 'Database setup complete' : 'Database setup failed');
      process.exit(success ? 0 : 1);
    });
} else {
  // Export for use in other modules
  module.exports = initDatabase;
} 