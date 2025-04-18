const { Pool } = require('pg');

// Database configuration with enhanced SSL and error handling
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'job_portal',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false,
    // You can add CA certificate if provided by your database host
    // ca: process.env.DB_CA_CERT
  } : false,
  // Connection timeout
  connectionTimeoutMillis: 10000,
  // Maximum number of clients the pool should contain
  max: 20
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
  query: async (text, params) => {
    try {
      const start = Date.now();
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (err) {
      console.error('Query error:', err);
      throw err;
    }
  },
  pool
}; 