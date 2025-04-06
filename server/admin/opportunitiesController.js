const pool = require('../config/database');

const getJobOpportunities = async (req, res) => {
  try {
    // Extract query parameters with defaults
    const {
      search = '',
      filters = [],
      page = 1,
      limit = 10,
      sortBy = 'scraped_at',
      sortDir = 'desc'
    } = req.query;
    
    // Parse page and limit to integers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    
    // Build base query
    let query = 'SELECT * FROM job_opportunities WHERE 1=1';
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
    
    // Handle filters - convert to array if it's a string
    let filtersArray = [];
    if (filters) {
      filtersArray = Array.isArray(filters) ? filters : [filters];
      
      // Only add filter condition if there are filters
      if (filtersArray.length > 0) {
        try {
          // First try to see if filters is already JSON
          if (typeof filters === 'string' && filters.startsWith('[')) {
            filtersArray = JSON.parse(filters);
          }
          
          query += ` AND filters @> $${paramIndex}::jsonb`;
          queryParams.push(JSON.stringify(filtersArray));
          paramIndex++;
        } catch (err) {
          console.error('Error parsing filters:', err);
        }
      }
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
    
    // Format response to match frontend expectations
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
    console.error('Error getting job opportunities:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve job opportunities',
      error: error.message
    });
  }
};

const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'approved', 'inactive'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }
    
    // Update job status in database
    const query = `
      UPDATE job_opportunities
      SET 
        status = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await pool.query(query, [status, id]);
    
    // Check if a job was updated
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Job opportunity not found'
      });
    }
    
    // Return updated job
    res.json({
      status: 'success',
      message: `Job opportunity status updated to ${status}`,
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update job status',
      error: error.message
    });
  }
};

// Add new function to delete a job opportunity by ID
const deleteJobOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete the job from database
    const query = `
      DELETE FROM job_opportunities
      WHERE id = $1
      RETURNING id
    `;
    
    const result = await pool.query(query, [id]);
    
    // Check if a job was deleted
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Job opportunity not found'
      });
    }
    
    // Return success response
    res.json({
      status: 'success',
      message: 'Job opportunity deleted successfully',
      data: { id: result.rows[0].id }
    });
    
  } catch (error) {
    console.error('Error deleting job opportunity:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete job opportunity',
      error: error.message
    });
  }
};

module.exports = {
  getJobOpportunities,
  updateJobStatus,
  deleteJobOpportunity
}; 