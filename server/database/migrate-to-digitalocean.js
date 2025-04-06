/**
 * Database migration script to transfer data from local PostgreSQL to DigitalOcean
 * 
 * Usage:
 * 1. Make sure both the source and target database configurations are set
 * 2. Run this script with: node migrate-to-digitalocean.js
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

// Source database (local)
const sourcePool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'job_portal',
  password: 'postgres',
  port: 5432
});

// Target database (DigitalOcean)
const targetPool = new Pool({
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
console.log('Target DB Connection: ', {
  user: targetPool.options.user,
  host: targetPool.options.host,
  database: targetPool.options.database,
  port: targetPool.options.port,
  ssl: targetPool.options.ssl ? 'enabled' : 'disabled'
});

// Get the SQL schema
const schema = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');

async function migrateDatabase() {
  try {
    console.log('Starting database migration to DigitalOcean...');

    // Test connection to target database first
    console.log('Testing connection to target database...');
    await targetPool.query('SELECT NOW()');
    console.log('Successfully connected to target database.');

    // 1. Initialize schema on target database
    console.log('Creating schema on target database...');
    await targetPool.query(schema);
    console.log('Schema created successfully.');

    // 2. Get data from source database
    console.log('Fetching data from source database...');
    
    // Migrate job_resources
    const resourcesResult = await sourcePool.query('SELECT * FROM job_resources');
    console.log(`Found ${resourcesResult.rows.length} job resources to migrate.`);
    
    // Migrate job_opportunities
    const opportunitiesResult = await sourcePool.query('SELECT * FROM job_opportunities');
    console.log(`Found ${opportunitiesResult.rows.length} job opportunities to migrate.`);
    
    // Migrate admin_users
    const adminUsersResult = await sourcePool.query('SELECT * FROM admin_users');
    console.log(`Found ${adminUsersResult.rows.length} admin users to migrate.`);

    // 3. Insert data into target database
    console.log('Migrating data to target database...');
    
    // Insert job resources
    for (const resource of resourcesResult.rows) {
      await targetPool.query(
        `INSERT INTO job_resources(id, name, url, filters, created_at, updated_at) 
         VALUES($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE 
         SET name = EXCLUDED.name, 
             url = EXCLUDED.url, 
             filters = EXCLUDED.filters,
             updated_at = EXCLUDED.updated_at`,
        [
          resource.id,
          resource.name,
          resource.url,
          resource.filters,
          resource.created_at,
          resource.updated_at
        ]
      );
    }
    console.log('Job resources migrated successfully.');
    
    // Insert job opportunities
    for (const opportunity of opportunitiesResult.rows) {
      await targetPool.query(
        `INSERT INTO job_opportunities(
          id, title, company, location, salary, description, link, 
          source, filters, status, scraped_at, created_at, updated_at
         ) 
         VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (link) DO UPDATE 
         SET title = EXCLUDED.title,
             company = EXCLUDED.company,
             location = EXCLUDED.location,
             salary = EXCLUDED.salary,
             description = EXCLUDED.description,
             source = EXCLUDED.source,
             filters = EXCLUDED.filters,
             status = EXCLUDED.status,
             updated_at = EXCLUDED.updated_at`,
        [
          opportunity.id,
          opportunity.title,
          opportunity.company,
          opportunity.location,
          opportunity.salary,
          opportunity.description, 
          opportunity.link,
          opportunity.source,
          opportunity.filters,
          opportunity.status,
          opportunity.scraped_at,
          opportunity.created_at,
          opportunity.updated_at
        ]
      );
    }
    console.log('Job opportunities migrated successfully.');
    
    // Insert admin users
    for (const user of adminUsersResult.rows) {
      await targetPool.query(
        `INSERT INTO admin_users(
          id, first_name, last_name, email, phone, username, 
          password, role, created_at, updated_at
         ) 
         VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (email) DO UPDATE 
         SET first_name = EXCLUDED.first_name,
             last_name = EXCLUDED.last_name,
             phone = EXCLUDED.phone,
             username = EXCLUDED.username,
             password = EXCLUDED.password,
             role = EXCLUDED.role,
             updated_at = EXCLUDED.updated_at`,
        [
          user.id,
          user.first_name,
          user.last_name,
          user.email,
          user.phone,
          user.username,
          user.password,
          user.role,
          user.created_at,
          user.updated_at
        ]
      );
    }
    console.log('Admin users migrated successfully.');

    // 4. Reset sequences for auto-increment IDs
    console.log('Resetting sequences...');
    
    // Reset job_resources_id_seq
    await targetPool.query(`
      SELECT setval('job_resources_id_seq', (SELECT MAX(id) FROM job_resources));
    `);
    
    // Reset job_opportunities_id_seq
    await targetPool.query(`
      SELECT setval('job_opportunities_id_seq', (SELECT MAX(id) FROM job_opportunities));
    `);
    
    // Reset admin_users_id_seq
    await targetPool.query(`
      SELECT setval('admin_users_id_seq', (SELECT MAX(id) FROM admin_users));
    `);
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close pool connections
    sourcePool.end();
    targetPool.end();
  }
}

// Run the migration
migrateDatabase(); 