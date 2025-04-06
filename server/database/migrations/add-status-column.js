const pool = require('../../config/database');

async function addStatusColumn() {
  const client = await pool.connect();
  
  try {
    console.log('Starting migration: Adding status column to job_opportunities table');
    
    // Begin transaction
    await client.query('BEGIN');
    
    // Check if status column already exists
    const columnCheck = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'job_opportunities' 
      AND column_name = 'status'
    `);
    
    if (columnCheck.rows.length === 0) {
      console.log('Status column does not exist. Adding it...');
      
      // Add the status column if it doesn't exist
      await client.query(`
        ALTER TABLE job_opportunities 
        ADD COLUMN status VARCHAR(50) DEFAULT 'pending'
      `);
      
      // Create an index on the status column
      await client.query(`
        CREATE INDEX IF NOT EXISTS job_opportunities_status_idx 
        ON job_opportunities (status)
      `);
      
      console.log('Status column added successfully!');
    } else {
      console.log('Status column already exists. Skipping...');
    }
    
    // Commit transaction
    await client.query('COMMIT');
    console.log('Migration completed successfully!');
    
  } catch (error) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    throw error;
  } finally {
    // Release client back to pool
    client.release();
  }
}

// Execute the migration if this file is run directly
if (require.main === module) {
  addStatusColumn()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch(err => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}

module.exports = { addStatusColumn }; 