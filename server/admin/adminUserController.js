/**
 * Admin User Controller
 * Handles operations related to admin users
 */
const pool = require('../config/database');
const bcrypt = require('bcrypt');

/**
 * Create a new admin user
 */
const createAdminUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      username,
      password,
      role
    } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !username || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }
    
    // Check if email or username already exists
    const checkQuery = 'SELECT * FROM admin_users WHERE email = $1 OR username = $2';
    const checkResult = await pool.query(checkQuery, [email, username]);
    
    if (checkResult.rows.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Email or username already exists'
      });
    }
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insert new admin user
    const query = `
      INSERT INTO admin_users 
      (first_name, last_name, email, phone, username, password, role, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING id, first_name, last_name, email, phone, username, role, created_at
    `;
    
    const values = [
      firstName,
      lastName,
      email,
      phone || '',
      username,
      hashedPassword,
      role || 'assistant'
    ];
    
    const result = await pool.query(query, values);
    
    res.status(201).json({
      status: 'success',
      message: 'Admin user created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create admin user',
      error: error.message
    });
  }
};

/**
 * Get all admin users
 */
const getAllAdminUsers = async (req, res) => {
  try {
    const query = `
      SELECT 
        id, first_name, last_name, email, phone, username, role, created_at, updated_at
      FROM 
        admin_users
      ORDER BY 
        created_at DESC
    `;
    
    const result = await pool.query(query);
    
    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch admin users',
      error: error.message
    });
  }
};

/**
 * Get a single admin user by ID
 */
const getAdminUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        id, first_name, last_name, email, phone, username, role, created_at, updated_at
      FROM 
        admin_users
      WHERE 
        id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Admin user not found'
      });
    }
    
    res.json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching admin user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch admin user',
      error: error.message
    });
  }
};

/**
 * Update an admin user
 */
const updateAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      username,
      password,
      role
    } = req.body;
    
    // Check if user exists
    const checkQuery = 'SELECT * FROM admin_users WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Admin user not found'
      });
    }
    
    // Check if email or username already exists for other users
    if (email || username) {
      const duplicateQuery = 'SELECT * FROM admin_users WHERE (email = $1 OR username = $2) AND id != $3';
      const duplicateResult = await pool.query(duplicateQuery, [email, username, id]);
      
      if (duplicateResult.rows.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Email or username already exists'
        });
      }
    }
    
    // Build update query dynamically
    let updateFields = [];
    let values = [];
    let valueIndex = 1;
    
    if (firstName) {
      updateFields.push(`first_name = $${valueIndex++}`);
      values.push(firstName);
    }
    
    if (lastName) {
      updateFields.push(`last_name = $${valueIndex++}`);
      values.push(lastName);
    }
    
    if (email) {
      updateFields.push(`email = $${valueIndex++}`);
      values.push(email);
    }
    
    if (phone !== undefined) {
      updateFields.push(`phone = $${valueIndex++}`);
      values.push(phone);
    }
    
    if (username) {
      updateFields.push(`username = $${valueIndex++}`);
      values.push(username);
    }
    
    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateFields.push(`password = $${valueIndex++}`);
      values.push(hashedPassword);
    }
    
    if (role) {
      updateFields.push(`role = $${valueIndex++}`);
      values.push(role);
    }
    
    updateFields.push(`updated_at = NOW()`);
    
    // If no fields to update
    if (updateFields.length === 1) {
      return res.status(400).json({
        status: 'error',
        message: 'No fields to update'
      });
    }
    
    // Add ID to values array
    values.push(id);
    
    const query = `
      UPDATE admin_users
      SET ${updateFields.join(', ')}
      WHERE id = $${valueIndex}
      RETURNING id, first_name, last_name, email, phone, username, role, created_at, updated_at
    `;
    
    const result = await pool.query(query, values);
    
    res.json({
      status: 'success',
      message: 'Admin user updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating admin user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update admin user',
      error: error.message
    });
  }
};

/**
 * Delete an admin user
 */
const deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const checkQuery = 'SELECT * FROM admin_users WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Admin user not found'
      });
    }
    
    // Delete user
    const query = 'DELETE FROM admin_users WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    
    res.json({
      status: 'success',
      message: 'Admin user deleted successfully',
      data: { id: result.rows[0].id }
    });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete admin user',
      error: error.message
    });
  }
};

module.exports = {
  createAdminUser,
  getAllAdminUsers,
  getAdminUserById,
  updateAdminUser,
  deleteAdminUser
}; 