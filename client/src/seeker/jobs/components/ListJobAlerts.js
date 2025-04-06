import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';
import './JobAlerts.css';

const ListJobAlerts = ({ onEdit, refresh }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch job alerts
  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/seeker/job-alerts');
      
      if (!response.ok) {
        throw new Error('Failed to fetch job alerts');
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setAlerts(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch job alerts');
      }
    } catch (error) {
      console.error('Error fetching job alerts:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load alerts on component mount or when refresh prop changes
  useEffect(() => {
    fetchAlerts();
  }, [refresh]);

  // Handle delete alert
  const handleDeleteAlert = async (id) => {
    setDeleteLoading(true);
    
    try {
      const response = await fetch(`/api/seeker/job-alerts/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete job alert');
      }
      
      // Remove from state
      setAlerts(alerts.filter(alert => alert.id !== id));
      setSuccessMessage('Job alert deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Error deleting job alert:', error);
      setError(error.message);
    } finally {
      setDeleteLoading(false);
      setDeleteAlert(null);
    }
  };

  // Format filters for display
  const formatFilters = (filters) => {
    if (!filters) return [];
    
    try {
      const parsedFilters = typeof filters === 'string' ? JSON.parse(filters) : filters;
      return parsedFilters;
    } catch (error) {
      console.error('Error parsing filters:', error);
      return [];
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="list-job-alerts">
      <h3>Your Job Alerts</h3>
      
      {successMessage && (
        <div className="alert-success">
          <FiCheck /> {successMessage}
        </div>
      )}
      
      {error && (
        <div className="alert-error">
          <FiAlertCircle /> {error}
        </div>
      )}
      
      {loading ? (
        <div className="alerts-loading">Loading job alerts...</div>
      ) : alerts.length === 0 ? (
        <div className="no-alerts">
          <p>You don't have any job alerts yet.</p>
        </div>
      ) : (
        <div className="alerts-container">
          {alerts.map(alert => {
            const filters = formatFilters(alert.filters);
            
            return (
              <div key={alert.id} className="alert-card">
                <div className="alert-header">
                  <h4>{alert.name}</h4>
                  <div className="alert-actions">
                    <button 
                      className="edit-btn" 
                      onClick={() => onEdit(alert)}
                      title="Edit Alert"
                    >
                      <FiEdit />
                    </button>
                    <button 
                      className="delete-btn" 
                      onClick={() => setDeleteAlert(alert.id)}
                      title="Delete Alert"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
                
                <div className="alert-created">
                  Created: {formatDate(alert.created_at)}
                </div>
                
                <div className="alert-filters">
                  {filters.map((filter, index) => (
                    <div key={index} className="alert-filter">
                      <h5>{filter.label}:</h5>
                      <div className="filter-elements">
                        {filter.elements.map((element, elemIndex) => (
                          <span key={elemIndex} className="element-badge">
                            {element}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {deleteAlert && (
        <div className="delete-modal-backdrop">
          <div className="delete-modal">
            <h4>Delete Job Alert</h4>
            <p>Are you sure you want to delete this job alert? This action cannot be undone.</p>
            
            <div className="delete-actions">
              <button 
                className="cancel-btn" 
                onClick={() => setDeleteAlert(null)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button 
                className="confirm-delete-btn" 
                onClick={() => handleDeleteAlert(deleteAlert)}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListJobAlerts; 