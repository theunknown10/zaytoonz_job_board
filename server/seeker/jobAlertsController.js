/**
 * Job Alerts Controller
 * Handles job alerts operations for job seekers
 */
const pool = require('../config/database');

// Create a new job alert
const createJobAlert = async (req, res) => {
  try {
    const { name, filters } = req.body;
    
    // Basic validation
    if (!name || !filters || !Array.isArray(filters) || filters.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Name and at least one filter are required'
      });
    }
    
    // TODO: Get user_id from auth middleware in real application
    const user_id = 1; // Mock user ID for now
    
    const query = `
      INSERT INTO job_alerts (user_id, name, filters)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await pool.query(query, [user_id, name, JSON.stringify(filters)]);
    
    res.status(201).json({
      status: 'success',
      message: 'Job alert created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating job alert:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create job alert',
      error: error.message
    });
  }
};

// Get all job alerts for a user
const getJobAlerts = async (req, res) => {
  try {
    // TODO: Get user_id from auth middleware in real application
    const user_id = 1; // Mock user ID for now
    
    const query = `
      SELECT * FROM job_alerts
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query, [user_id]);
    
    res.status(200).json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    console.error('Error getting job alerts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get job alerts',
      error: error.message
    });
  }
};

// Get a single job alert by ID
const getJobAlertById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Get user_id from auth middleware in real application
    const user_id = 1; // Mock user ID for now
    
    const query = `
      SELECT * FROM job_alerts
      WHERE id = $1 AND user_id = $2
    `;
    
    const result = await pool.query(query, [id, user_id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Job alert not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error getting job alert:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get job alert',
      error: error.message
    });
  }
};

// Update a job alert
const updateJobAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, filters, is_active } = req.body;
    
    // Basic validation
    if ((!name && !filters && is_active === undefined) || 
        (filters && (!Array.isArray(filters) || filters.length === 0))) {
      return res.status(400).json({
        status: 'error',
        message: 'At least one field to update is required'
      });
    }
    
    // TODO: Get user_id from auth middleware in real application
    const user_id = 1; // Mock user ID for now
    
    // Check if alert exists and belongs to user
    const checkQuery = `
      SELECT * FROM job_alerts
      WHERE id = $1 AND user_id = $2
    `;
    
    const checkResult = await pool.query(checkQuery, [id, user_id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Job alert not found'
      });
    }
    
    // Prepare update fields
    const updates = [];
    const values = [id, user_id];
    let valueIndex = 3;
    
    if (name) {
      updates.push(`name = $${valueIndex}`);
      values.push(name);
      valueIndex++;
    }
    
    if (filters) {
      updates.push(`filters = $${valueIndex}`);
      values.push(JSON.stringify(filters));
      valueIndex++;
    }
    
    if (is_active !== undefined) {
      updates.push(`is_active = $${valueIndex}`);
      values.push(is_active);
      valueIndex++;
    }
    
    // Add updated_at timestamp
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    
    const updateQuery = `
      UPDATE job_alerts
      SET ${updates.join(', ')}
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
    
    const result = await pool.query(updateQuery, values);
    
    res.status(200).json({
      status: 'success',
      message: 'Job alert updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating job alert:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update job alert',
      error: error.message
    });
  }
};

// Delete a job alert
const deleteJobAlert = async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Get user_id from auth middleware in real application
    const user_id = 1; // Mock user ID for now
    
    const query = `
      DELETE FROM job_alerts
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `;
    
    const result = await pool.query(query, [id, user_id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Job alert not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Job alert deleted successfully',
      data: { id: result.rows[0].id }
    });
  } catch (error) {
    console.error('Error deleting job alert:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete job alert',
      error: error.message
    });
  }
};

module.exports = {
  createJobAlert,
  getJobAlerts,
  getJobAlertById,
  updateJobAlert,
  deleteJobAlert
}; 