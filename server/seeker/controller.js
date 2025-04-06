/**
 * Job Seeker Controller
 * Handles all job seeker-related operations
 */
const pool = require('../config/database');

// Get job seeker dashboard data
const getDashboardData = async (req, res) => {
  try {
    // This is a placeholder for future implementation
    const dashboardData = {
      status: 'success',
      message: 'Job seeker dashboard data retrieved successfully',
      data: {
        // Dashboard data will go here
      }
    };
    
    res.status(200).json(dashboardData);
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to retrieve job seeker dashboard data',
      error: error.message 
    });
  }
};

// Get approved job opportunities
const getApprovedJobs = async (req, res) => {
  try {
    // Extract query parameters with defaults
    const {
      search = '',
      page = 1,
      limit = 10,
      sortBy = 'scraped_at',
      sortDir = 'desc'
    } = req.query;
    
    // Parse page and limit to integers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    
    // Build base query - only return approved jobs
    let query = "SELECT * FROM job_opportunities WHERE status = 'approved'";
    const queryParams = [];
    let paramIndex = 1;
    
    // Add search condition if provided
    if (search && search.trim() !== '') {
      query += ` AND (
        title ILIKE $${paramIndex} OR
        company ILIKE $${paramIndex} OR
        location ILIKE $${paramIndex} OR
        description ILIKE $${paramIndex}
      )`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }
    
    // Get total count for pagination
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await pool.query(countQuery, queryParams);
    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limitNum);
    
    // Add sorting and pagination
    query += ` ORDER BY ${sortBy} ${sortDir}`;
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limitNum, (pageNum - 1) * limitNum);
    
    // Execute query
    const result = await pool.query(query, queryParams);
    
    // Format response
    res.json({
      status: 'success',
      data: result.rows,
      pagination: {
        total: totalItems,
        page: pageNum,
        limit: limitNum,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error getting approved jobs:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve approved job opportunities',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardData,
  getApprovedJobs
}; 