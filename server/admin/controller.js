/**
 * Admin Controller
 * Handles all admin-related operations
 */
const pool = require('../config/database');

// Get admin dashboard data
const getDashboardData = async (req, res) => {
  try {
    // This is a placeholder for future implementation
    const dashboardData = {
      status: 'success',
      message: 'Admin dashboard data retrieved successfully',
      data: {
        // Dashboard data will go here
      }
    };
    
    res.status(200).json(dashboardData);
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to retrieve admin dashboard data',
      error: error.message 
    });
  }
};

// Create a new job resource
const createJobResource = async (req, res) => {
  try {
    const { name, url, filters } = req.body;
    
    // Validate required fields
    if (!name || !url) {
      return res.status(400).json({
        status: 'error',
        message: 'Name and URL are required fields'
      });
    }
    
    // Insert into database
    const query = `
      INSERT INTO job_resources (name, url, filters, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id, name, url, filters, created_at
    `;
    
    const values = [name, url, JSON.stringify(filters)];
    const result = await pool.query(query, values);
    
    res.status(201).json({
      status: 'success',
      message: 'Job resource created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating job resource:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create job resource',
      error: error.message
    });
  }
};

const getJobResources = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM job_resources ORDER BY created_at DESC'
    );
    
    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching job resources:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch job resources'
    });
  }
};

const updateJobResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, url, filters } = req.body;
    
    // Validate required fields
    if (!name || !url) {
      return res.status(400).json({
        status: 'error',
        message: 'Name and URL are required fields'
      });
    }
    
    // Update in database
    const query = `
      UPDATE job_resources 
      SET name = $1, url = $2, filters = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING id, name, url, filters, created_at, updated_at
    `;
    
    const values = [name, url, JSON.stringify(filters), id];
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Resource not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Job resource updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating job resource:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update job resource'
    });
  }
};

const deleteJobResource = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete from database
    const query = 'DELETE FROM job_resources WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Resource not found'
      });
    }
    
    res.json({
      status: 'success',
      message: 'Job resource deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job resource:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete job resource'
    });
  }
};

module.exports = {
  getDashboardData,
  createJobResource,
  getJobResources,
  updateJobResource,
  deleteJobResource
}; 