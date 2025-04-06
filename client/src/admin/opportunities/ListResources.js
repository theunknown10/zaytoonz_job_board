import React, { useState, useEffect } from 'react';
import { FiExternalLink, FiSearch, FiLoader, FiAlertCircle, FiEdit2, FiTrash2, FiX, FiCheck, FiPlus, FiDatabase, FiList } from 'react-icons/fi';
import './ListResources.css';
import '../AdminButtons.css';

const ListResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [editingResource, setEditingResource] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    url: '',
    filters: []
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [newFilter, setNewFilter] = useState('');
  const [predefinedFilters] = useState([
    'Job Title', 'Industry', 'Location', 'Qualifications', 
    'Work Schedule', 'Salary', 'Danger', 'Company size'
  ]);
  const [scrapingResource, setScrapingResource] = useState(null);
  
  // New state for scraped results
  const [scrapeResults, setScrapeResults] = useState([]);
  const [loadingScrapeResults, setLoadingScrapeResults] = useState(false);
  const [selectedScrapeResult, setSelectedScrapeResult] = useState(null);
  const [scrapeResultData, setScrapeResultData] = useState(null);
  const [showScrapeResultsModal, setShowScrapeResultsModal] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/admin/resources/jobs');
      const responseText = await response.text();
      
      try {
        const data = JSON.parse(responseText);
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch resources');
        }
        setResources(data.data);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource.id);
    setEditForm({
      name: resource.name,
      url: resource.url,
      filters: resource.filters
    });
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`/api/admin/resources/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update resource');
      }

      // Update the resources list with the updated resource
      setResources(resources.map(resource => 
        resource.id === id ? { ...resource, ...editForm } : resource
      ));
      setEditingResource(null);
    } catch (error) {
      console.error('Error updating resource:', error);
      alert('Failed to update resource. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/admin/resources/jobs/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete resource');
      }

      // Remove the deleted resource from the list
      setResources(resources.filter(resource => resource.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Failed to delete resource. Please try again.');
    }
  };

  const handleFilterClick = (filter) => {
    setEditForm(prev => ({
      ...prev,
      filters: prev.filters.includes(filter)
        ? prev.filters.filter(f => f !== filter)
        : [...prev.filters, filter]
    }));
  };

  const handleAddCustomFilter = (e) => {
    e.preventDefault();
    if (newFilter.trim() && !editForm.filters.includes(newFilter.trim())) {
      setEditForm(prev => ({
        ...prev,
        filters: [...prev.filters, newFilter.trim()]
      }));
      setNewFilter('');
    }
  };

  const handleRemoveFilter = (filterToRemove) => {
    setEditForm(prev => ({
      ...prev,
      filters: prev.filters.filter(filter => filter !== filterToRemove)
    }));
  };

  // Get unique filters from all resources
  const allFilters = [...new Set(resources.flatMap(resource => resource.filters))];

  // Filter resources based on search term and selected filter
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || resource.filters.includes(selectedFilter);
    return matchesSearch && matchesFilter;
  });

  const handleScrap = async (resource) => {
    try {
      setScrapingResource(resource.id);
      
      const response = await fetch('/api/admin/resources/api/jobs/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceId: resource.id
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to start scraping');
      }

      // Instead of alerting, wait a moment and then fetch and display results
      setTimeout(async () => {
        // Fetch the scrape results
        try {
          setLoadingScrapeResults(true);
          const resultsResponse = await fetch('/api/admin/resources/api/scrape-results');
          
          if (!resultsResponse.ok) {
            throw new Error('Failed to fetch scrape results');
          }
          
          const resultsData = await resultsResponse.json();
          
          if (resultsData.data && resultsData.data.length > 0) {
            // Get the most recent result (should be the one we just created)
            const latestResult = resultsData.data[0];
            setScrapeResults(resultsData.data);
            
            // Load the latest result data
            const resultResponse = await fetch(`/api/admin/resources/api/scrape-results/${latestResult.filename}`);
            if (resultResponse.ok) {
              const resultData = await resultResponse.json();
              setSelectedScrapeResult(latestResult.filename);
              setScrapeResultData(resultData);
              
              // Open the modal to display the results
              setShowScrapeResultsModal(true);
            }
          }
        } catch (error) {
          console.error('Error fetching scrape results:', error);
          alert(`Scraping completed, but unable to display results: ${error.message}`);
        } finally {
          setLoadingScrapeResults(false);
        }
      }, 2000); // Wait 2 seconds to give the server time to complete and save the results
      
    } catch (error) {
      console.error('Error starting scrape:', error);
      alert(`Failed to start scraping: ${error.message}`);
    } finally {
      setScrapingResource(null);
    }
  };

  // Function to fetch scraped results
  const fetchScrapeResults = async () => {
    try {
      setLoadingScrapeResults(true);
      const response = await fetch('/api/admin/resources/api/scrape-results');
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch scrape results');
      }
      
      const data = await response.json();
      setScrapeResults(data.data || []);
      
      // Open the modal
      setShowScrapeResultsModal(true);
    } catch (error) {
      console.error('Error fetching scrape results:', error);
      alert(`Failed to fetch scrape results: ${error.message}`);
    } finally {
      setLoadingScrapeResults(false);
    }
  };
  
  // Function to view a specific scrape result
  const viewScrapeResult = async (filename) => {
    try {
      setSelectedScrapeResult(filename);
      setScrapeResultData(null);
      
      const response = await fetch(`/api/admin/resources/api/scrape-results/${filename}`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to fetch scrape result');
      }
      
      const data = await response.json();
      setScrapeResultData(data);
    } catch (error) {
      console.error('Error fetching scrape result:', error);
      alert(`Failed to fetch scrape result: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="list-resources-container loading">
        <FiLoader className="loading-spinner" />
        <p>Loading resources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="list-resources-container error">
        <FiAlertCircle className="error-icon" />
        <p>Error: {error}</p>
        <button onClick={fetchResources} className="admin-button primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="list-resources-container">
      <div className="resources-header">
        <div className="header-content">
          <h3>Job Resources</h3>
          <p className="subtitle">Browse and filter available job resources</p>
        </div>
        <div className="header-actions">
          <button 
            className={`admin-button secondary ${loadingScrapeResults ? 'loading' : ''}`}
            onClick={fetchScrapeResults}
            disabled={loadingScrapeResults}
          >
            {loadingScrapeResults ? <FiLoader className="spinner" /> : <FiList />} View Scrape Results
          </button>
        </div>
      </div>

      <div className="resources-filters">
        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-dropdown">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="all">All Filters</option>
            {allFilters.map(filter => (
              <option key={filter} value={filter}>{filter}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredResources.length === 0 ? (
        <div className="no-resources">
          <p>No resources found matching your criteria.</p>
        </div>
      ) : (
        <div className="resources-table">
          <div className="table-header">
            <div className="col-name">Name</div>
            <div className="col-url">URL</div>
            <div className="col-filters">Filters</div>
            <div className="col-date">Added Date</div>
            <div className="col-scrap">Scrap</div>
            <div className="col-actions">Actions</div>
          </div>
          
          <div className="table-body">
            {filteredResources.map(resource => (
              <div key={resource.id} className="table-row">
                {editingResource === resource.id ? (
                  // Edit mode
                  <div className="row-edit-mode">
                    <div className="edit-fields">
                      <input
                        type="text"
                        className="edit-input"
                        placeholder="Resource Name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                      <input
                        type="url"
                        className="edit-input"
                        placeholder="Resource URL"
                        value={editForm.url}
                        onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                      />
                      
                      {/* Filters Section */}
                      <div className="edit-filters-section">
                        <h5>Selected Filters:</h5>
                        <div className="selected-filters">
                          {editForm.filters.map(filter => (
                            <span key={filter} className="filter-tag editable">
                              {filter}
                              <FiX 
                                className="remove-filter" 
                                onClick={() => handleRemoveFilter(filter)}
                              />
                            </span>
                          ))}
                        </div>

                        <h5>Predefined Filters:</h5>
                        <div className="predefined-filters">
                          {predefinedFilters.map(filter => (
                            <span
                              key={filter}
                              className={`filter-tag clickable ${editForm.filters.includes(filter) ? 'selected' : ''}`}
                              onClick={() => handleFilterClick(filter)}
                            >
                              {filter}
                            </span>
                          ))}
                        </div>

                        <div className="custom-filter-input">
                          <input
                            type="text"
                            placeholder="Add custom filter"
                            value={newFilter}
                            onChange={(e) => setNewFilter(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddCustomFilter(e)}
                          />
                          <button 
                            className="admin-button small primary"
                            onClick={handleAddCustomFilter}
                          >
                            <FiPlus className="admin-button-icon" /> Add
                          </button>
                        </div>
                      </div>

                      <div className="action-buttons admin-button-group">
                        <button 
                          className="admin-button save"
                          onClick={() => handleUpdate(resource.id)}
                          title="Save"
                        >
                          <FiCheck />
                        </button>
                        <button 
                          className="admin-button cancel"
                          onClick={() => {
                            setEditingResource(null);
                            setNewFilter('');
                          }}
                          title="Cancel"
                        >
                          <FiX />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <>
                    <div className="col-name">{resource.name}</div>
                    <div className="col-url">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                        Visit <FiExternalLink />
                      </a>
                    </div>
                    <div className="col-filters">
                      {resource.filters.map(filter => (
                        <span key={filter} className="filter-tag">{filter}</span>
                      ))}
                    </div>
                    <div className="col-date">
                      {new Date(resource.created_at).toLocaleDateString()}
                    </div>
                    <div className="col-scrap">
                      <button 
                        className={`admin-button primary ${scrapingResource === resource.id ? 'loading' : ''}`}
                        onClick={() => handleScrap(resource)}
                        disabled={scrapingResource === resource.id}
                        title="Scrap and view results immediately"
                      >
                        {scrapingResource === resource.id ? <FiLoader className="spinner" /> : <FiDatabase />}
                      </button>
                    </div>
                    <div className="col-actions">
                      <button 
                        className="admin-button edit"
                        onClick={() => handleEdit(resource)}
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      {deleteConfirm === resource.id ? (
                        <>
                          <button 
                            className="admin-button danger"
                            onClick={() => handleDelete(resource.id)}
                            title="Confirm Delete"
                          >
                            <FiCheck />
                          </button>
                          <button 
                            className="admin-button cancel"
                            onClick={() => setDeleteConfirm(null)}
                            title="Cancel"
                          >
                            <FiX />
                          </button>
                        </>
                      ) : (
                        <button 
                          className="admin-button delete"
                          onClick={() => setDeleteConfirm(resource.id)}
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for displaying scrape results */}
      {showScrapeResultsModal && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <div className="modal-header">
              <h3>
                Scrape Results
                {loadingScrapeResults && <span className="loading-status"> (Loading latest results...)</span>}
                {!loadingScrapeResults && scrapeResultData && <span className="result-status"> - {scrapeResultData.resource?.name}</span>}
              </h3>
              <button 
                className="close-button" 
                onClick={() => {
                  setShowScrapeResultsModal(false);
                  setSelectedScrapeResult(null);
                  setScrapeResultData(null);
                }}
              >
                <FiX />
              </button>
            </div>
            
            <div className="modal-content">
              {scrapeResults.length === 0 ? (
                <p>No scrape results found.</p>
              ) : (
                <div className="scrape-results-container">
                  <div className="scrape-results-list">
                    <h4>Available Results</h4>
                    <ul>
                      {scrapeResults.map(result => (
                        <li 
                          key={result.filename}
                          className={selectedScrapeResult === result.filename ? 'selected' : ''}
                          onClick={() => viewScrapeResult(result.filename)}
                        >
                          <span className="result-name">{result.filename}</span>
                          <span className="result-date">{new Date(result.createdAt).toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="scrape-result-content">
                    {selectedScrapeResult ? (
                      scrapeResultData ? (
                        <div className="json-content">
                          <h4>Scraped Data from {scrapeResultData.resource?.name}</h4>
                          <div className="json-info">
                            <p><strong>Resource URL:</strong> {scrapeResultData.resource?.url}</p>
                            <p><strong>Scraped At:</strong> {new Date(scrapeResultData.scrapedAt).toLocaleString()}</p>
                            <p><strong>Jobs Found:</strong> {scrapeResultData.processedJobs?.length || 0}</p>
                          </div>
                          
                          <div className="json-tabs">
                            <button className="tab active">Formatted</button>
                            <button className="tab">Raw JSON</button>
                          </div>
                          
                          <div className="jobs-list">
                            {scrapeResultData.processedJobs?.map((job, index) => (
                              <div key={index} className="job-item">
                                <h5>{job.title}</h5>
                                <p className="company-info">
                                  <span className="company">{job.company}</span>
                                  <span className="location">{job.location}</span>
                                </p>
                                {job.salary && <p className="salary">{job.salary}</p>}
                                <p className="description">{job.description}</p>
                                {job.link && (
                                  <a href={job.link} target="_blank" rel="noopener noreferrer" className="job-link">
                                    View Job <FiExternalLink />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="loading-container">
                          <FiLoader className="loading-spinner" />
                          <p>Loading scrape result...</p>
                        </div>
                      )
                    ) : (
                      <div className="empty-state">
                        <p>Select a scrape result to view details</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListResources; 