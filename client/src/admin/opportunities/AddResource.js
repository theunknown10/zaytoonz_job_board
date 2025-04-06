import React, { useState } from 'react';
import { FiSave, FiPlusCircle, FiX, FiCheck, FiLoader } from 'react-icons/fi';
import './AddResource.css';
import '../AdminButtons.css';

const AddResource = () => {
  const [resourceName, setResourceName] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [newFilter, setNewFilter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null

  // Predefined filters
  const predefinedFilters = [
    'Job Title',
    'Industry',
    'Location',
    'Qualifications',
    'Work Schedule',
    'Salary',
    'Danger',
    'Company size'
  ];

  const handleAddFilter = () => {
    if (newFilter.trim() !== '' && !selectedFilters.includes(newFilter.trim())) {
      setSelectedFilters([...selectedFilters, newFilter.trim()]);
      setNewFilter('');
    }
  };

  const handleRemoveFilter = (filter) => {
    setSelectedFilters(selectedFilters.filter(f => f !== filter));
  };

  const handlePredefinedFilterClick = (filter) => {
    if (!selectedFilters.includes(filter)) {
      setSelectedFilters([...selectedFilters, filter]);
    } else {
      handleRemoveFilter(filter);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    // Create resource object
    const newResource = {
      name: resourceName,
      url: resourceUrl,
      filters: selectedFilters
    };
    
    try {
      console.log('Sending request to:', '/api/admin/resources/jobs');
      console.log('Request payload:', newResource);
      
      const response = await fetch('/api/admin/resources/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newResource)
      });
      
      // Log the raw response for debugging
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error('Invalid response format from server');
      }
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save resource');
      }
      
      // Reset form on success
      setResourceName('');
      setResourceUrl('');
      setSelectedFilters([]);
      setSubmitStatus('success');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving resource:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-resource-container">
      <h3>Add New Job Resource</h3>
      <p className="subtitle">Create a new job resource to be used for job opportunities</p>
      
      {submitStatus === 'success' && (
        <div className="status-message success">
          <FiCheck className="status-icon" />
          Resource saved successfully!
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="status-message error">
          <FiX className="status-icon" />
          Failed to save resource. Please try again.
        </div>
      )}
      
      <form className="resource-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="resourceName">Resource Name</label>
          <input
            type="text"
            id="resourceName"
            value={resourceName}
            onChange={(e) => setResourceName(e.target.value)}
            placeholder="Enter resource name"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="resourceUrl">Resource URL</label>
          <input
            type="url"
            id="resourceUrl"
            value={resourceUrl}
            onChange={(e) => setResourceUrl(e.target.value)}
            placeholder="https://example.com"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="form-group">
          <label>Filters</label>
          <div className="predefined-filters">
            {predefinedFilters.map((filter) => (
              <button
                type="button"
                key={filter}
                className={`filter-tag ${selectedFilters.includes(filter) ? 'selected' : ''}`}
                onClick={() => handlePredefinedFilterClick(filter)}
                disabled={isSubmitting}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="newFilter">Add Custom Filter</label>
          <div className="new-filter-input">
            <input
              type="text"
              id="newFilter"
              value={newFilter}
              onChange={(e) => setNewFilter(e.target.value)}
              placeholder="Enter custom filter"
              disabled={isSubmitting}
            />
            <button 
              type="button" 
              className="admin-button small primary"
              onClick={handleAddFilter}
              disabled={isSubmitting}
              title="Add Filter"
            >
              <FiPlusCircle />
            </button>
          </div>
        </div>
        
        {selectedFilters.length > 0 && (
          <div className="form-group">
            <label>Selected Filters</label>
            <div className="selected-filters">
              {selectedFilters.map((filter) => (
                <div key={filter} className="selected-filter">
                  <span>{filter}</span>
                  <button 
                    type="button" 
                    className="remove-filter" 
                    onClick={() => handleRemoveFilter(filter)}
                    disabled={isSubmitting}
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <button 
          type="submit" 
          className="admin-button save large"
          disabled={isSubmitting}
          title="Save Resource"
        >
          {isSubmitting ? (
            <FiLoader className="loading-icon" />
          ) : (
            <FiSave />
          )}
        </button>
      </form>
    </div>
  );
};

export default AddResource; 