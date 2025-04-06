/**
 * Migration to create job_alerts table
 */
const pool = require('../../config/database');

const createJobAlertsTable = async () => {
  try {
    console.log('Creating job_alerts table...');
    
    // Check if table already exists
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'job_alerts'
      );
    `;
    
    const tableExists = await pool.query(checkTableQuery);
    
    if (tableExists.rows[0].exists) {
      console.log('job_alerts table already exists. Skipping creation.');
      return;
    }
    
    // Create the job_alerts table
    const createQuery = `
      CREATE TABLE job_alerts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        name VARCHAR(255) NOT NULL,
        filters JSONB NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await pool.query(createQuery);
    console.log('job_alerts table created successfully!');
    
  } catch (error) {
    console.error('Error creating job_alerts table:', error);
    throw error;
  }
};

const runMigration = async () => {
  try {
    console.log('Starting job alerts migration...');
    
    // Connect to the database
    await pool.connect();
    console.log('Connected to PostgreSQL database');
    
    await createJobAlertsTable();
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
};

// Run the migration
runMigration(); 