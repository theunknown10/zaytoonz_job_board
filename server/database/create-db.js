/**
 * Script to create database structure in DigitalOcean PostgreSQL
 * 
 * Use this if you just want to create the tables without migrating data
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const fs = require('fs');
const { Pool } = require('pg');

// Debug the environment variables loading
console.log('Environment variables loaded:');
console.log('  DB_USER:', process.env.DB_USER);
console.log('  DB_HOST:', process.env.DB_HOST);
console.log('  DB_NAME:', process.env.DB_NAME);
console.log('  DB_PASSWORD length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0);
console.log('  DB_PORT:', process.env.DB_PORT);
console.log('  DB_SSL:', process.env.DB_SSL);

// DigitalOcean database connection with hardcoded fallbacks
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
console.log('DB Connection: ', {
  user: pool.options.user,
  host: pool.options.host,
  database: pool.options.database,
  port: pool.options.port,
  ssl: pool.options.ssl ? 'enabled' : 'disabled'
});

async function createDatabase() {
  try {
    console.log('Creating database structure...');

    // Test connection first
    console.log('Testing database connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('Connected successfully at:', result.rows[0].now);

    // Read SQL schema
    const sqlPath = path.join(__dirname, 'init.sql');
    const sqlCommands = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute SQL commands
    console.log('Executing SQL commands...');
    await pool.query(sqlCommands);
    
    console.log('Database structure created successfully');
  } catch (error) {
    console.error('Error creating database structure:', error);
  } finally {
    pool.end();
  }
}

// Run the script
createDatabase(); 