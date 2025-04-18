const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

// Construct connection string for DigitalOcean managed database
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=require`;

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
    sslmode: 'require'
  }
});

// Enhanced connection handling
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
  
  // Only exit for critical connection errors
  if (err.code === 'PROTOCOL_CONNECTION_LOST' || 
      err.code === 'ECONNREFUSED' || 
      err.code === 'ETIMEDOUT') {
    console.error('Critical database error - shutting down');
    process.exit(1);
  }
});

// Export pool with additional error handling
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
}; 