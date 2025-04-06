import React, { useState, useEffect } from 'react';
import { FiPlus, FiX, FiSave } from 'react-icons/fi';
import './JobAlerts.css';

const AddJobAlert = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [filters, setFilters] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterElement, setFilterElement] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableFilterTypes, setAvailableFilterTypes] = useState([
    { id: 'company', label: 'Company' },
    { id: 'location', label: 'Location' },
    { id: 'skills', label: 'Skills' },
    { id: 'jobType', label: 'Job Type' },
    { id: 'salary', label: 'Salary Range' },
  ]);

  const handleAddFilter = () => {
    if (!filterType) return;
    
    // Check if this filter type already exists
    const existingFilterIndex = filters.findIndex(f => f.type === filterType);
    
    if (existingFilterIndex === -1) {
      // Create a new filter
      const selectedFilter = availableFilterTypes.find(f => f.id === filterType);
      setFilters([...filters, {
        type: filterType,
        label: selectedFilter.label,
        elements: []
      }]);
    }
    
    setFilterType('');
  };

  const handleAddElement = (filterIndex) => {
    if (!filterElement) return;
    
    const updatedFilters = [...filters];
    
    // Avoid duplicate elements
    if (!updatedFilters[filterIndex].elements.includes(filterElement)) {
      updatedFilters[filterIndex].elements.push(filterElement);
      setFilters(updatedFilters);
    }
    
    setFilterElement('');
  };

  const handleRemoveElement = (filterIndex, elementIndex) => {
    const updatedFilters = [...filters];
    updatedFilters[filterIndex].elements.splice(elementIndex, 1);
    setFilters(updatedFilters);
  };

  const handleRemoveFilter = (filterIndex) => {
    const updatedFilters = [...filters];
    updatedFilters.splice(filterIndex, 1);
    setFilters(updatedFilters);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim()) {
      setError('Please enter a name for the job alert');
      return;
    }
    
    if (filters.length === 0) {
      setError('Please add at least one filter');
      return;
    }
    
    // Check if at least one filter has elements
    const hasElements = filters.some(filter => filter.elements.length > 0);
    if (!hasElements) {
      setError('Please add at least one element to a filter');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Format data for API
      const formattedFilters = filters.map(filter => ({
        type: filter.type,
        label: filter.label,
        elements: filter.elements
      }));
      
      // Call API to create job alert
      const response = await fetch('/api/seeker/job-alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          filters: formattedFilters
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create job alert');
      }
      
      // Reset form
      setName('');
      setFilters([]);
      
      // Notify parent component
      if (onSuccess) {
        onSuccess(data.data);
      }
      
    } catch (error) {
      console.error('Error creating job alert:', error);
      setError(error.message || 'Failed to create job alert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-job-alert">
      <h3>Create Job Alert</h3>
      
      {error && (
        <div className="alert-error">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="alertName">Alert Name *</label>
          <input
            type="text"
            id="alertName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="E.g., Senior Developer Positions"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Add Filters</label>
          <div className="filter-selector">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Select Filter Type</option>
              {availableFilterTypes
                .filter(type => !filters.some(f => f.type === type.id))
                .map(type => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))
              }
            </select>
            <button 
              type="button" 
              className="add-filter-btn"
              onClick={handleAddFilter}
              disabled={!filterType}
            >
              <FiPlus /> Add
            </button>
          </div>
        </div>
        
        {filters.length > 0 && (
          <div className="filters-container">
            {filters.map((filter, filterIndex) => (
              <div key={filterIndex} className="filter-card">
                <div className="filter-header">
                  <h4>{filter.label}</h4>
                  <button 
                    type="button" 
                    className="remove-filter-btn"
                    onClick={() => handleRemoveFilter(filterIndex)}
                  >
                    <FiX />
                  </button>
                </div>
                
                <div className="element-input">
                  <input
                    type="text"
                    placeholder={`Add ${filter.label} (press Enter)`}
                    value={filterIndex === filters.length - 1 ? filterElement : ''}
                    onChange={(e) => setFilterElement(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddElement(filterIndex);
                      }
                    }}
                  />
                  <button 
                    type="button"
                    onClick={() => handleAddElement(filterIndex)}
                  >
                    <FiPlus />
                  </button>
                </div>
                
                {filter.elements.length > 0 && (
                  <div className="elements-list">
                    {filter.elements.map((element, elementIndex) => (
                      <div key={elementIndex} className="element-tag">
                        <span>{element}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveElement(filterIndex, elementIndex)}
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating...' : (
              <>
                <FiSave /> Save Job Alert
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddJobAlert; 