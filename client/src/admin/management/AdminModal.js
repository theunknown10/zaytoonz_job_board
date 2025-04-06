import React, { useState } from 'react';
import { FiX, FiLoader } from 'react-icons/fi';
import './AdminModal.css';

const AdminModal = ({ mode, admin, onClose, onEditSuccess, onDeleteSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: admin.first_name,
    lastName: admin.last_name,
    email: admin.email,
    phone: admin.phone || '',
    username: admin.username,
    password: '',
    confirmPassword: '',
    role: admin.role
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate required fields for edit mode
    if (mode === 'edit') {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.username.trim()) newErrors.username = 'Username is required';
      
      // Only validate password if it's provided
      if (formData.password) {
        if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/admin/users/${admin.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          username: formData.username,
          ...(formData.password && { password: formData.password }),
          role: formData.role
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update admin user');
      }
      
      onEditSuccess(data.data);
    } catch (error) {
      console.error('Error updating admin user:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/admin/users/${admin.id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete admin user');
      }
      
      onDeleteSuccess(admin.id);
    } catch (error) {
      console.error('Error deleting admin user:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="modal-backdrop">
      <div className="admin-modal">
        <div className="modal-header">
          <h3>
            {mode === 'view' && 'Admin User Details'}
            {mode === 'edit' && 'Edit Admin User'}
            {mode === 'delete' && 'Delete Admin User'}
          </h3>
          <button className="close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        {error && (
          <div className="modal-error">
            {error}
          </div>
        )}
        
        {mode === 'view' && (
          <div className="admin-details">
            <div className="detail-row">
              <div className="detail-label">Name</div>
              <div className="detail-value">{admin.first_name} {admin.last_name}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Email</div>
              <div className="detail-value">{admin.email}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Phone</div>
              <div className="detail-value">{admin.phone || 'Not provided'}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Username</div>
              <div className="detail-value">{admin.username}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Role</div>
              <div className="detail-value">
                <span className={`role-badge ${admin.role}`}>
                  {admin.role}
                </span>
              </div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Created</div>
              <div className="detail-value">{formatDate(admin.created_at)}</div>
            </div>
            {admin.updated_at && (
              <div className="detail-row">
                <div className="detail-label">Last Updated</div>
                <div className="detail-value">{formatDate(admin.updated_at)}</div>
              </div>
            )}
          </div>
        )}
        
        {mode === 'edit' && (
          <form onSubmit={handleUpdate} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? 'error' : ''}
                  disabled={loading}
                />
                {errors.firstName && <div className="error-text">{errors.firstName}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? 'error' : ''}
                  disabled={loading}
                />
                {errors.lastName && <div className="error-text">{errors.lastName}</div>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  disabled={loading}
                />
                {errors.email && <div className="error-text">{errors.email}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={errors.username ? 'error' : ''}
                  disabled={loading}
                />
                {errors.username && <div className="error-text">{errors.username}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="assistant">Assistant</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">New Password (optional)</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  disabled={loading}
                  placeholder="Leave blank to keep current password"
                />
                {errors.password && <div className="error-text">{errors.password}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  disabled={loading || !formData.password}
                />
                {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                type="button" 
                className="cancel-button" 
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="save-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FiLoader className="loading-icon-small" /> Saving...
                  </>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
        
        {mode === 'delete' && (
          <div className="delete-confirmation">
            <p>Are you sure you want to delete this admin user?</p>
            <p className="delete-warning">This action cannot be undone.</p>
            
            <div className="admin-summary">
              <strong>{admin.first_name} {admin.last_name}</strong>
              <span>{admin.email}</span>
              <span className="role-badge-small">{admin.role}</span>
            </div>
            
            <div className="modal-actions">
              <button 
                type="button" 
                className="cancel-button" 
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="delete-button"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FiLoader className="loading-icon-small" /> Deleting...
                  </>
                ) : 'Delete User'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModal; 