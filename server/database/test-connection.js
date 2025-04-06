/**
 * Simple script to test connection to the PostgreSQL database
 */

// Use path to correctly locate the .env file
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { Pool } = require('pg');

// Debug the environment variables loading
console.log('Environment variables loaded:');
console.log('  DB_USER:', process.env.DB_USER);
console.log('  DB_HOST:', process.env.DB_HOST);
console.log('  DB_NAME:', process.env.DB_NAME);
console.log('  DB_PASSWORD length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0);
console.log('  DB_PORT:', process.env.DB_PORT);
console.log('  DB_SSL:', process.env.DB_SSL);

// Create a connection pool with hardcoded values if env vars are missing
const pool = new Pool({
  user: process.env.DB_USER || 'doadmin',
  host: process.env.DB_HOST || 'db-postgresql-lon1-24441-do-user-15284964-0.e.db.ondigitalocean.com',
  database: process.env.DB_NAME || 'defaultdb',
  password: process.env.DB_PASSWORD || 'AVNS_ewBk1inDsnKk7g5YcfP',
  port: parseInt(process.env.DB_PORT || '25060', 10),
  ssl: {
    rejectUnauthorized: false
  }
});

// Print connection details (without password) for debugging
console.log('Attempting to connect to database with:');
console.log('  User:', pool.options.user);
console.log('  Host:', pool.options.host);
console.log('  Database:', pool.options.database);
console.log('  Port:', pool.options.port);
console.log('  SSL:', pool.options.ssl ? 'enabled' : 'disabled');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Simple query to test the connection
    const result = await pool.query('SELECT NOW() as current_time');
    
    console.log('✅ Connection successful!');
    console.log('Server time:', result.rows[0].current_time);
    
    // Test if the job_opportunities table exists
    try {
      const tableResult = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'job_opportunities'
        ) as table_exists
      `);
      
      if (tableResult.rows[0].table_exists) {
        console.log('✅ job_opportunities table exists');
        
        // Get row count
        const countResult = await pool.query('SELECT COUNT(*) FROM job_opportunities');
        console.log(`   ${countResult.rows[0].count} rows in job_opportunities table`);
      } else {
        console.log('❌ job_opportunities table does not exist');
      }
    } catch (error) {
      console.log('❌ Error checking for job_opportunities table:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    // Close the connection pool
    await pool.end();
  }
}

// Run the test
testConnection(); 