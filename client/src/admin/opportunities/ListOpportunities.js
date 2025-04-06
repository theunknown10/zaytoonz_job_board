import React, { useState, useEffect } from 'react';
import { FiSearch, FiLoader, FiAlertCircle, FiExternalLink, FiCheckCircle, FiXCircle, FiFilter, FiCheckSquare, FiFileText, FiTrash2 } from 'react-icons/fi';
import '../AdminButtons.css';
import './ListOpportunities.css';

// Local storage key for status updates
const STATUS_UPDATES_KEY = 'job_opportunity_status_updates';

const ListOpportunities = () => {
  // Load initial status updates from local storage if available
  const initialStatusUpdates = JSON.parse(localStorage.getItem(STATUS_UPDATES_KEY) || '{}');
  
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState(initialStatusUpdates);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  // New state variables for enhanced functionality
  const [sourceFilter, setSourceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [availableSources, setAvailableSources] = useState([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  // Add new state for delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const predefinedFilters = [
    'Job Title', 'Industry', 'Location', 'Qualifications', 
    'Work Schedule', 'Salary', 'Danger', 'Company size'
  ];

  // Save status updates to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(STATUS_UPDATES_KEY, JSON.stringify(statusUpdates));
  }, [statusUpdates]);

  useEffect(() => {
    fetchOpportunities();
  }, [searchTerm, selectedFilters, pagination.page, sourceFilter, statusFilter]);

  // Reset selection when data changes
  useEffect(() => {
    setSelectedJobs([]);
    setSelectAll(false);
  }, [opportunities]);

  useEffect(() => {
    // Update selectedJobs when selectAll changes
    if (selectAll) {
      setSelectedJobs(opportunities.map(job => job.id));
    } else {
      setSelectedJobs([]);
    }
  }, [selectAll, opportunities]);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const queryParams = new URLSearchParams({
        search: searchTerm,
        page: pagination.page,
        limit: pagination.limit
      });

      // Add filters if any are selected
      if (selectedFilters.length > 0) {
        queryParams.append('filters', JSON.stringify(selectedFilters));
      }

      // Add source filter if not "all"
      if (sourceFilter !== 'all') {
        queryParams.append('source', sourceFilter);
      }

      // Add status filter if not "all"
      if (statusFilter !== 'all') {
        queryParams.append('status', statusFilter);
      }

      const response = await fetch(`/api/admin/opportunities?${queryParams}`);
      
      // Check for OK status first
      if (!response.ok) {
        const text = await response.text();
        console.error('Raw response:', text);
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || 'Failed to fetch opportunities');
        } catch (parseError) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      
      // Make sure data has the expected format
      if (!data || !data.status || data.status !== 'success') {
        throw new Error('Invalid response format from server');
      }
      
      // Apply any cached status updates to the new data
      const updatedData = data.data.map(job => {
        if (statusUpdates[job.id]) {
          return { ...job, status: statusUpdates[job.id] };
        }
        return job;
      });
      
      setOpportunities(updatedData);
      
      if (data.pagination) {
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total || 0,
          totalPages: data.pagination.totalPages || 0
        }));
      }

      // Extract and set available sources
      const sources = ['all', ...new Set(updatedData.map(job => job.source).filter(Boolean))];
      setAvailableSources(sources);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      setError(error.message);
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterToggle = (filter) => {
    setSelectedFilters(prev => 
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      setStatusUpdating(id);
      
      const response = await fetch(`/api/admin/opportunities/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        const text = await response.text();
        console.error('Raw response:', text);
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || `Failed to ${status} opportunity`);
        } catch (parseError) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }
      
      // Get the response data
      const data = await response.json();
      
      // Store the status update in our cache with a timestamp
      setStatusUpdates(prev => ({
        ...prev,
        [id]: status
      }));
      
      // Update the status in our UI directly
      setOpportunities(opportunities.map(job => 
        job.id === id ? { ...job, status } : job
      ));
    } catch (error) {
      console.error(`Error updating status to "${status}":`, error);
      alert(`Failed to update status: ${error.message}`);
    } finally {
      setStatusUpdating(null);
    }
  };

  // New function for handling batch status updates
  const handleBatchStatusUpdate = async (status) => {
    if (selectedJobs.length === 0) {
      alert('Please select at least one job to update.');
      return;
    }

    try {
      setStatusUpdating('batch');
      
      // Create an array of promises for all the status updates
      const updatePromises = selectedJobs.map(jobId => 
        fetch(`/api/admin/opportunities/${jobId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        })
      );
      
      // Wait for all status updates to complete
      const results = await Promise.allSettled(updatePromises);
      
      // Count successful and failed updates
      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;
      
      // Update the statuses in our cache
      const newStatusUpdates = { ...statusUpdates };
      selectedJobs.forEach(id => {
        newStatusUpdates[id] = status;
      });
      setStatusUpdates(newStatusUpdates);
      
      // Update the statuses in our UI directly
      setOpportunities(opportunities.map(job => 
        selectedJobs.includes(job.id) ? { ...job, status } : job
      ));
      
      // Clear the selection
      setSelectedJobs([]);
      setSelectAll(false);
      
      // Show a success message
      alert(`Status updated to ${status} for ${successful} job(s). ${failed > 0 ? `Failed for ${failed} job(s).` : ''}`);
    } catch (error) {
      console.error(`Error in batch status update to "${status}":`, error);
      alert(`Error in batch update: ${error.message}`);
    } finally {
      setStatusUpdating(null);
    }
  };

  // Toggle job selection
  const toggleJobSelection = (jobId) => {
    setSelectedJobs(prev => {
      const isSelected = prev.includes(jobId);
      if (isSelected) {
        return prev.filter(id => id !== jobId);
      } else {
        return [...prev, jobId];
      }
    });
  };

  // Add function to handle opportunity deletion
  const handleDelete = async (id) => {
    try {
      setStatusUpdating(id);
      
      const response = await fetch(`/api/admin/opportunities/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const text = await response.text();
        console.error('Raw response:', text);
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || 'Failed to delete opportunity');
        } catch (parseError) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }
      
      // Remove the deleted opportunity from our UI
      setOpportunities(opportunities.filter(job => job.id !== id));
      setDeleteConfirm(null);
      
      // Show success message
      alert('Opportunity deleted successfully');
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      alert(`Failed to delete opportunity: ${error.message}`);
    } finally {
      setStatusUpdating(null);
    }
  };

  if (error) {
    return (
      <div className="opportunities-container error">
        <FiAlertCircle className="error-icon" />
        <p>Error: {error}</p>
        <button onClick={fetchOpportunities} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="list-opportunities-container">
      <div className="opportunities-header">
        <div className="header-top">
          <h3>Job Opportunities</h3>
        </div>
        
        <div className="search-and-filters">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
            />
          </div>

          <button
            className={`filter-toggle-button ${showFilterPanel ? 'active' : ''}`}
            onClick={() => setShowFilterPanel(!showFilterPanel)}
          >
            <FiFilter /> Filters
          </button>
        </div>

        {showFilterPanel && (
          <div className="advanced-filters-panel">
            <div className="filter-section">
              <h4>Filter by Source</h4>
              <select
                value={sourceFilter}
                onChange={(e) => {
                  setSourceFilter(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
              >
                {availableSources.map(source => (
                  <option key={source} value={source}>
                    {source === 'all' ? 'All Sources' : source}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-section">
              <h4>Filter by Status</h4>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="filter-section">
              <h4>Job Categories</h4>
              <div className="filter-tags">
                {predefinedFilters.map(filter => (
                  <button
                    key={filter}
                    className={`filter-tag ${selectedFilters.includes(filter) ? 'selected' : ''}`}
                    onClick={() => handleFilterToggle(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Batch Actions */}
      {selectedJobs.length > 0 && (
        <div className="batch-actions">
          <span className="selected-count">
            {selectedJobs.length} job{selectedJobs.length !== 1 ? 's' : ''} selected
          </span>
          <div className="batch-buttons">
            <button
              className="admin-button primary"
              onClick={() => handleBatchStatusUpdate('approved')}
              disabled={statusUpdating === 'batch'}
            >
              {statusUpdating === 'batch' ? <FiLoader className="spinning" /> : <FiCheckCircle />} 
              Approve Selected
            </button>
            <button
              className="admin-button delete"
              onClick={() => handleBatchStatusUpdate('inactive')}
              disabled={statusUpdating === 'batch'}
            >
              {statusUpdating === 'batch' ? <FiLoader className="spinning" /> : <FiXCircle />} 
              Deactivate Selected
            </button>
            <button
              className="admin-button secondary"
              onClick={() => {
                setSelectedJobs([]);
                setSelectAll(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <FiLoader className="loading-spinner" />
          <p>Loading opportunities...</p>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="no-opportunities">
          <p>No opportunities found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="opportunities-table">
            <div className="table-header">
              <div className="col-checkbox">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={() => setSelectAll(!selectAll)}
                  title="Select all jobs"
                />
              </div>
              <div className="col-title">Title</div>
              <div className="col-company">Company</div>
              <div className="col-location">Location</div>
              <div className="col-salary">Salary</div>
              <div className="col-source">Source</div>
              <div className="col-actions">Actions</div>
              <div className="col-manage">Manage</div>
            </div>
            
            <div className="table-body">
              {opportunities.map(job => (
                <div key={job.id} className={`table-row ${selectedJobs.includes(job.id) ? 'selected' : ''}`}>
                  <div className="col-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedJobs.includes(job.id)}
                      onChange={() => toggleJobSelection(job.id)}
                      title="Select this job"
                    />
                  </div>
                  <div className="col-title">
                    <h4>{job.title}</h4>
                    <div className="job-filters">
                      {(function() {
                        try {
                          // Try to parse filters as JSON
                          let filtersArray = [];
                          if (typeof job.filters === 'string') {
                            filtersArray = JSON.parse(job.filters);
                          } else if (Array.isArray(job.filters)) {
                            filtersArray = job.filters;
                          }
                          return filtersArray.map(filter => (
                            <span key={filter} className="filter-tag small">{filter}</span>
                          ));
                        } catch (err) {
                          console.error('Error parsing filters:', err);
                          return null;
                        }
                      })()}
                    </div>
                  </div>
                  <div className="col-company" data-label="Company">
                    {job.company}
                  </div>
                  <div className="col-location" data-label="Location">
                    {job.location}
                  </div>
                  <div className="col-salary" data-label="Salary">
                    {job.salary || 'Not specified'}
                  </div>
                  <div className="col-source" data-label="Source">
                    {job.source ? (
                      <span className="source-badge">
                        {job.source.includes('scrape') ? <FiFileText /> : null}
                        {job.source}
                      </span>
                    ) : 'Unknown'}
                  </div>
                  <div className="col-actions">
                    <a 
                      href={job.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="view-button"
                    >
                      View <FiExternalLink />
                    </a>
                  </div>
                  <div className="col-manage">
                    <div className="status-buttons">
                      <button 
                        className={`admin-button ${job.status === 'approved' ? 'primary' : 'secondary'}`}
                        onClick={() => handleStatusUpdate(job.id, 'approved')}
                        disabled={statusUpdating === job.id || job.status === 'approved'}
                        title="Approve"
                      >
                        {statusUpdating === job.id ? <FiLoader /> : <FiCheckCircle />}
                      </button>
                      <button 
                        className={`admin-button ${job.status === 'inactive' ? 'delete' : 'secondary'}`}
                        onClick={() => handleStatusUpdate(job.id, 'inactive')}
                        disabled={statusUpdating === job.id || job.status === 'inactive'}
                        title="Deactivate"
                      >
                        {statusUpdating === job.id ? <FiLoader /> : <FiXCircle />}
                      </button>
                      {deleteConfirm === job.id ? (
                        <button 
                          className="admin-button danger"
                          onClick={() => handleDelete(job.id)}
                          disabled={statusUpdating === job.id}
                          title="Confirm Delete"
                        >
                          {statusUpdating === job.id ? <FiLoader /> : "Confirm"}
                        </button>
                      ) : (
                        <button 
                          className="admin-button delete"
                          onClick={() => setDeleteConfirm(job.id)}
                          disabled={statusUpdating === job.id}
                          title="Delete"
                        >
                          {statusUpdating === job.id ? <FiLoader /> : <FiTrash2 />}
                        </button>
                      )}
                    </div>
                    {job.status && (
                      <div className={`status-badge ${job.status}`}>
                        {job.status}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pagination">
            <button
              className="page-button"
              disabled={pagination.page === 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              Previous
            </button>
            <span className="page-info">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              className="page-button"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ListOpportunities; 