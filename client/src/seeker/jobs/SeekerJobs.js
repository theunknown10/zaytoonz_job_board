import React, { useState, useEffect } from 'react';
import { FiMenu, FiBell, FiSearch, FiBookmark, FiExternalLink, FiPlus, FiEdit, FiTrash2, FiFilter, FiX, FiChevronDown, FiChevronUp, FiSave } from 'react-icons/fi';
import SeekerSidebar from '../SeekerSidebar';
import '../Dashboard.css';
import './SeekerJobs.css';

const SeekerJobs = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedJobSections, setSavedJobSections] = useState([
    { id: 1, name: 'All Saved Jobs', jobs: [] },
    { id: 2, name: 'Priority Applications', jobs: [] },
    { id: 3, name: 'Interesting', jobs: [] },
  ]);
  const [newSectionName, setNewSectionName] = useState('');
  const [isAddingSectionName, setIsAddingSectionName] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtersLoading, setFiltersLoading] = useState(true);
  
  // Filter states
  const [nameFilter, setNameFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState([]);
  const [activeAdvancedFilters, setActiveAdvancedFilters] = useState([]);

  // Add these new state variables
  const [savedAlerts, setSavedAlerts] = useState([]);
  const [isAlertsDropdownOpen, setIsAlertsDropdownOpen] = useState(false);
  const [alertsLoading, setAlertsLoading] = useState(false);

  useEffect(() => {
    // Load saved jobs from localStorage
    const loadSavedJobs = () => {
      try {
        const savedJobsString = localStorage.getItem('savedJobs');
        if (savedJobsString) {
          const savedJobsData = JSON.parse(savedJobsString);
          setSavedJobs(savedJobsData);
          
          // Update sections with saved jobs
          const updatedSections = savedJobSections.map(section => {
            if (section.id === 1) { // All Saved Jobs
              return {
                ...section,
                jobs: savedJobsData
              };
            } else if (section.id === 2) { // Priority Applications
              return {
                ...section,
                jobs: savedJobsData.filter(job => job.sectionIds.includes(2))
              };
            } else if (section.id === 3) { // Interesting
              return {
                ...section,
                jobs: savedJobsData.filter(job => job.sectionIds.includes(3))
              };
            }
            return section;
          });
          
          setSavedJobSections(updatedSections);
        }
      } catch (error) {
        console.error('Error loading saved jobs from localStorage:', error);
      }
    };
    
    loadSavedJobs();
  }, []);

  useEffect(() => {
    // Fetch real data from API
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // Real API call to fetch approved jobs
        const response = await fetch('/api/seeker/jobs');
        
        if (!response.ok) {
          throw new Error('Failed to fetch job opportunities');
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && Array.isArray(data.data)) {
          // Transform data to match our expected format
          const fetchedJobs = data.data.map(job => {
            // Handle filters parsing safely
            let parsedTags = [];
            if (job.filters) {
              try {
                // Try to parse the filters as JSON
                parsedTags = JSON.parse(job.filters);
                // If parsedTags is not an array, make it an array
                if (!Array.isArray(parsedTags)) {
                  parsedTags = [String(parsedTags)];
                }
              } catch (error) {
                console.warn(`Could not parse filters for job ${job.id}:`, error);
                // If the filters can't be parsed, use it as a single string tag
                if (typeof job.filters === 'string') {
                  parsedTags = [job.filters];
                }
              }
            }
            
            // Check if this job is already saved
            const isSaved = savedJobs.some(savedJob => savedJob.id === job.id);
            
            return {
              id: job.id,
              title: job.title,
              company: job.company,
              location: job.location,
              salary: job.salary || 'Not specified',
              description: job.description,
              postedDate: job.scraped_at || new Date().toISOString(),
              type: 'Full-time', // Default value
              tags: parsedTags,
              status: job.status,
              isSaved: isSaved
            };
          });

          setJobs(fetchedJobs);
          setFilteredJobs(fetchedJobs);
        } else {
          throw new Error('Invalid response format from server');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        // Use empty arrays as fallback
        setJobs([]);
        setFilteredJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [savedJobs]);

  // Fetch admin-defined filters
  useEffect(() => {
    const fetchFilters = async () => {
      setFiltersLoading(true);
      try {
        // In a real app, this would be an API call to get admin-defined filters
        // For now, simulate an API call with a timeout
        setTimeout(() => {
          // Mock response from the API with admin-defined filters
          const mockAdminFilters = [
            { id: 1, type: 'salary', label: 'Salary Range', adminDefined: true },
            { id: 2, type: 'tags', label: 'Skills', adminDefined: true },
            { id: 3, type: 'company', label: 'Company', adminDefined: true },
            { id: 4, type: 'jobType', label: 'Job Type', adminDefined: true },
            { id: 5, type: 'experience', label: 'Experience Level', adminDefined: true },
            { id: 6, type: 'industry', label: 'Industry', adminDefined: true },
          ];
          
          setAdvancedFilters(mockAdminFilters);
          setFiltersLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching admin filters:', error);
        // Fallback to basic filters if admin filters can't be loaded
        setAdvancedFilters([
          { id: 1, type: 'salary', label: 'Salary' },
          { id: 2, type: 'tags', label: 'Skills' },
          { id: 3, type: 'company', label: 'Company' }
        ]);
        setFiltersLoading(false);
      }
    };

    fetchFilters();
  }, []);

  // Apply filters to jobs
  useEffect(() => {
    if (jobs.length === 0) return;
    
    let result = [...jobs];
    
    // Apply simple filters
    if (nameFilter) {
      result = result.filter(job => 
        job.title.toLowerCase().includes(nameFilter.toLowerCase()) ||
        job.description.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    
    if (locationFilter) {
      result = result.filter(job => 
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    // Apply advanced filters
    activeAdvancedFilters.forEach(filter => {
      if (filter.value) {
        switch (filter.type) {
          case 'salary':
            result = result.filter(job => 
              job.salary.toLowerCase().includes(filter.value.toLowerCase())
            );
            break;
          case 'tags':
            result = result.filter(job => 
              job.tags.some(tag => tag.toLowerCase().includes(filter.value.toLowerCase()))
            );
            break;
          case 'company':
            result = result.filter(job => 
              job.company.toLowerCase().includes(filter.value.toLowerCase())
            );
            break;
          default:
            break;
        }
      }
    });
    
    setFilteredJobs(result);
  }, [jobs, nameFilter, locationFilter, activeAdvancedFilters]);

  // Add new useEffect to fetch saved job alerts
  useEffect(() => {
    const fetchSavedAlerts = async () => {
      setAlertsLoading(true);
      try {
        const response = await fetch('/api/seeker/job-alerts');
        
        if (!response.ok) {
          throw new Error('Failed to fetch job alerts');
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && Array.isArray(data.data)) {
          setSavedAlerts(data.data);
        }
      } catch (error) {
        console.error('Error fetching job alerts:', error);
      } finally {
        setAlertsLoading(false);
      }
    };
    
    fetchSavedAlerts();
  }, []);

  // Filter handling functions
  const handleNameFilterChange = (e) => {
    setNameFilter(e.target.value);
  };
  
  const handleLocationFilterChange = (e) => {
    setLocationFilter(e.target.value);
  };
  
  const handleAdvancedFilterChange = (id, value) => {
    setActiveAdvancedFilters(prev => {
      const existingFilter = prev.find(filter => filter.id === id);
      
      if (existingFilter) {
        // Update existing filter
        return prev.map(filter => 
          filter.id === id ? { ...filter, value } : filter
        );
      } else {
        // Add new filter
        const filterToAdd = advancedFilters.find(filter => filter.id === id);
        return [...prev, { ...filterToAdd, value }];
      }
    });
  };
  
  const addAdvancedFilter = (type) => {
    const filter = advancedFilters.find(f => f.type === type);
    if (filter && !activeAdvancedFilters.some(f => f.id === filter.id)) {
      setActiveAdvancedFilters([...activeAdvancedFilters, { ...filter, value: '' }]);
    }
  };
  
  const removeAdvancedFilter = (id) => {
    setActiveAdvancedFilters(prev => prev.filter(filter => filter.id !== id));
  };
  
  const resetAllFilters = () => {
    setNameFilter('');
    setLocationFilter('');
    setActiveAdvancedFilters([]);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleSaveJob = (jobId) => {
    // Check if the job is already saved
    const isJobAlreadySaved = savedJobs.some(savedJob => savedJob.id === jobId);
    
    if (isJobAlreadySaved) {
      // Job is already saved, show some feedback (could add a toast notification here)
      console.log('This job is already saved');
      return;
    }
    
    // Mark the job as saved in the jobs list (for UI feedback)
    const updatedJobs = jobs.map(job => 
      job.id === jobId ? { ...job, isSaved: true } : job
    );
    
    // Get the job to save
    const jobToSave = jobs.find(job => job.id === jobId);
    
    if (jobToSave) {
      // Add to saved jobs with sectionIds
      const jobWithSectionIds = { ...jobToSave, isSaved: true, sectionIds: [1] };
      const updatedSavedJobs = [...savedJobs, jobWithSectionIds];
      
      // Save to state and localStorage
      setSavedJobs(updatedSavedJobs);
      localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
      
      // Update the All Saved Jobs section
      const updatedSections = savedJobSections.map(section => {
        if (section.id === 1) {
          return {
            ...section,
            jobs: [...section.jobs, jobWithSectionIds]
          };
        }
        return section;
      });
      
      setSavedJobSections(updatedSections);
      setJobs(updatedJobs);
    }
  };

  const addNewSection = () => {
    if (newSectionName.trim() === '') return;
    
    const newSection = {
      id: Date.now(),
      name: newSectionName,
      jobs: []
    };
    
    setSavedJobSections([...savedJobSections, newSection]);
    setNewSectionName('');
    setIsAddingSectionName(false);
  };

  const updateSectionName = (sectionId) => {
    if (newSectionName.trim() === '') return;
    
    const updatedSections = savedJobSections.map(section => 
      section.id === sectionId ? { ...section, name: newSectionName } : section
    );
    
    setSavedJobSections(updatedSections);
    setNewSectionName('');
    setEditingSectionId(null);
  };

  const moveJobToSection = (jobId, sectionId, isAdding = true) => {
    // Find the job
    const job = savedJobs.find(job => job.id === jobId);
    
    if (!job) return;
    
    // Update the job's sectionIds
    let updatedSectionIds;
    if (isAdding) {
      // Add to section if not already there
      updatedSectionIds = job.sectionIds.includes(sectionId) 
        ? job.sectionIds 
        : [...job.sectionIds, sectionId];
    } else {
      // Remove from section
      updatedSectionIds = job.sectionIds.filter(id => id !== sectionId);
      
      // Always keep in All Saved Jobs (id 1)
      if (!updatedSectionIds.includes(1)) {
        updatedSectionIds.push(1);
      }
    }
    
    // Update savedJobs
    const updatedSavedJobs = savedJobs.map(job => 
      job.id === jobId ? { ...job, sectionIds: updatedSectionIds } : job
    );
    
    // Update state and localStorage
    setSavedJobs(updatedSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
    
    // Update each section
    const updatedSections = savedJobSections.map(section => {
      if (section.id === 1) {
        // All Saved Jobs - contains all saved jobs
        return {
          ...section,
          jobs: updatedSavedJobs
        };
      } else if (section.id === sectionId) {
        // If adding to this section
        if (isAdding) {
          return {
            ...section,
            jobs: [...section.jobs, { ...job, sectionIds: updatedSectionIds }]
          };
        } else {
          // If removing from this section
          return {
            ...section,
            jobs: section.jobs.filter(j => j.id !== jobId)
          };
        }
      } else {
        // Other sections remain unchanged
        return section;
      }
    });
    
    setSavedJobSections(updatedSections);
  };

  const handleDeleteSavedJob = (jobId) => {
    // Remove the job from savedJobs state
    const updatedSavedJobs = savedJobs.filter(job => job.id !== jobId);
    
    // Update state and localStorage
    setSavedJobs(updatedSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
    
    // Update all sections to remove the job
    const updatedSections = savedJobSections.map(section => ({
      ...section,
      jobs: section.jobs.filter(job => job.id !== jobId)
    }));
    
    setSavedJobSections(updatedSections);
    
    // Also update the main jobs list to reflect the removed saved status
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, isSaved: false } : job
    ));
  };

  // Add function to apply a saved alert as filter
  const applyAlertAsFilter = (alert) => {
    try {
      // Parse filters from alert
      const alertFilters = typeof alert.filters === 'string' 
        ? JSON.parse(alert.filters) 
        : alert.filters;
      
      // Reset current filters first
      resetAllFilters();
      
      // Apply each filter from the alert
      const newAdvancedFilters = [];
      
      alertFilters.forEach(filter => {
        if (filter.type === 'company' || filter.type === 'location') {
          // Apply simple filters
          if (filter.type === 'company' && filter.elements.length > 0) {
            // Use first company as filter for simplicity
            // Could be improved to search for any company in the array
            handleLocationFilterChange({ target: { value: filter.elements[0] } });
          } 
          else if (filter.type === 'location' && filter.elements.length > 0) {
            handleLocationFilterChange({ target: { value: filter.elements[0] } });
          }
        } 
        
        // Add to advanced filters
        if (filter.elements.length > 0) {
          const filterToAdd = advancedFilters.find(f => f.id === filter.type) || 
                             { id: filter.type, type: filter.type, label: filter.label };
                             
          // Add each element as separate filter for better results
          filter.elements.forEach(element => {
            newAdvancedFilters.push({
              ...filterToAdd,
              value: element
            });
          });
        }
      });
      
      // Apply advanced filters
      setActiveAdvancedFilters(newAdvancedFilters);
      
      // Ensure advanced filters section is open
      setIsAdvancedFilterOpen(true);
      
      // Close dropdown
      setIsAlertsDropdownOpen(false);
      
    } catch (error) {
      console.error('Error applying job alert as filter:', error);
    }
  };

  return (
    <div className="seeker-layout">
      <SeekerSidebar className={isMobileSidebarOpen ? 'open' : ''} />
      
      <div className="seeker-main">
        <header className="seeker-header">
          <button className="mobile-menu-toggle" onClick={toggleMobileSidebar}>
            <FiMenu />
          </button>
          <h1>Jobs</h1>
          <div className="header-actions">
            <button className="notifications-button">
              <FiBell />
            </button>
          </div>
        </header>
        
        <div className="seeker-content">
          <div className="dashboard-welcome">
            <h2>Find and Manage Job Opportunities</h2>
            <p>
              Discover job opportunities that match your skills, save them for later, and organize them into custom sections.
            </p>
          </div>
          
          <div className="jobs-tabs">
            <button 
              className={`tab-button ${activeTab === 'jobs' ? 'active' : ''}`}
              onClick={() => setActiveTab('jobs')}
            >
              <FiSearch className="tab-icon" />
              Jobs
            </button>
            <button 
              className={`tab-button ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              <FiBookmark className="tab-icon" />
              Saved Jobs
            </button>
          </div>
          
          {activeTab === 'jobs' && (
            <div className="jobs-container">
              <div className="filter-container">
                <div className="simple-filters">
                  <div className="filter-group">
                    <label htmlFor="nameFilter">Job Title or Keywords</label>
                    <div className="filter-input-wrapper">
                      <FiSearch className="filter-icon" />
                      <input
                        type="text"
                        id="nameFilter"
                        value={nameFilter}
                        onChange={handleNameFilterChange}
                        placeholder="Search by job title or keywords"
                      />
                      {nameFilter && (
                        <button className="clear-input" onClick={() => setNameFilter('')}>
                          <FiX />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="filter-group">
                    <label htmlFor="locationFilter">Location</label>
                    <div className="filter-input-wrapper">
                      <FiSearch className="filter-icon" />
                      <input
                        type="text"
                        id="locationFilter"
                        value={locationFilter}
                        onChange={handleLocationFilterChange}
                        placeholder="Filter by location"
                      />
                      {locationFilter && (
                        <button className="clear-input" onClick={() => setLocationFilter('')}>
                          <FiX />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="advanced-filters-toggle">
                  <div className="filter-buttons">
                    <button onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}>
                      <FiFilter /> Advanced Filters
                      {isAdvancedFilterOpen ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                    
                    <div className="saved-filters-dropdown">
                      <button 
                        className="apply-filter-btn"
                        onClick={() => setIsAlertsDropdownOpen(!isAlertsDropdownOpen)}
                      >
                        <FiSave /> Apply Saved Filter
                        {isAlertsDropdownOpen ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                      
                      {isAlertsDropdownOpen && (
                        <div className="alerts-dropdown-content">
                          {alertsLoading ? (
                            <div className="alert-loading">Loading saved filters...</div>
                          ) : savedAlerts.length === 0 ? (
                            <div className="no-alerts">No saved filters found</div>
                          ) : (
                            <>
                              {savedAlerts.map(alert => (
                                <div 
                                  key={alert.id} 
                                  className="alert-item"
                                  onClick={() => applyAlertAsFilter(alert)}
                                >
                                  {alert.name}
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {(nameFilter || locationFilter || activeAdvancedFilters.length > 0) && (
                    <button className="reset-filters" onClick={resetAllFilters}>
                      Reset all filters
                    </button>
                  )}
                </div>
                
                {isAdvancedFilterOpen && (
                  <div className="advanced-filters">
                    <div className="active-advanced-filters">
                      {activeAdvancedFilters.map(filter => (
                        <div key={filter.id} className="advanced-filter-item">
                          <label>{filter.label || filter.type.charAt(0).toUpperCase() + filter.type.slice(1)}</label>
                          <div className="filter-input-wrapper">
                            <input
                              type="text"
                              value={filter.value}
                              onChange={(e) => handleAdvancedFilterChange(filter.id, e.target.value)}
                              placeholder={`Filter by ${filter.label ? filter.label.toLowerCase() : filter.type}`}
                            />
                            <button 
                              className="remove-filter"
                              onClick={() => removeAdvancedFilter(filter.id)}
                            >
                              <FiX />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="add-filters">
                      <span>Add filter:</span>
                      {filtersLoading ? (
                        <span className="loading-filters">Loading filters...</span>
                      ) : (
                        advancedFilters
                          .filter(filter => !activeAdvancedFilters.some(af => af.id === filter.id))
                          .map(filter => (
                            <button 
                              key={filter.id}
                              className="add-filter-button"
                              onClick={() => addAdvancedFilter(filter.type)}
                            >
                              {filter.label || filter.type.charAt(0).toUpperCase() + filter.type.slice(1)}
                              {filter.adminDefined && <span className="admin-defined-badge"></span>}
                            </button>
                          ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="jobs-list">
                {loading ? (
                  <div className="loading-container">Loading jobs...</div>
                ) : filteredJobs.length === 0 ? (
                  <div className="no-jobs-message">No jobs found matching your filters</div>
                ) : (
                  filteredJobs.map(job => (
                    <div key={job.id} className="job-card">
                      <div className="job-header">
                        <h3 className="job-title">{job.title}</h3>
                        <button 
                          className={`save-button ${job.isSaved ? 'saved' : ''}`}
                          onClick={() => handleSaveJob(job.id)}
                          title={job.isSaved ? "Remove from saved jobs" : "Save job"}
                        >
                          <FiBookmark className={job.isSaved ? 'filled-bookmark' : ''} />
                        </button>
                      </div>
                      <div className="job-company">{job.company}</div>
                      <div className="job-details">
                        <span className="job-location">{job.location}</span>
                        <span className="job-salary">{job.salary}</span>
                      </div>
                      <div className="job-tags">
                        {job.tags.map((tag, index) => (
                          <span key={index} className="job-tag">{tag}</span>
                        ))}
                      </div>
                      <p className="job-description">{job.description}</p>
                      <div className="job-footer">
                        <span className="job-posted">Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                        <button className="apply-button">
                          Apply <FiExternalLink className="apply-icon" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'saved' && (
            <div className="saved-jobs-container">
              <div className="sections-sidebar">
                <h3>Sections</h3>
                <div className="sections-list">
                  {savedJobSections.map(section => (
                    <div key={section.id} className="section-item">
                      {editingSectionId === section.id ? (
                        <div className="edit-section-name">
                          <input
                            type="text"
                            value={newSectionName}
                            onChange={(e) => setNewSectionName(e.target.value)}
                            placeholder="Section name"
                          />
                          <button onClick={() => updateSectionName(section.id)}>Save</button>
                        </div>
                      ) : (
                        <>
                          <span>{section.name} ({section.jobs.length})</span>
                          {section.id > 3 && (
                            <button 
                              className="edit-section-button"
                              onClick={() => {
                                setEditingSectionId(section.id);
                                setNewSectionName(section.name);
                              }}
                            >
                              <FiEdit />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
                
                {isAddingSectionName ? (
                  <div className="add-section-form">
                    <input
                      type="text"
                      value={newSectionName}
                      onChange={(e) => setNewSectionName(e.target.value)}
                      placeholder="New section name"
                    />
                    <button onClick={addNewSection}>Add</button>
                  </div>
                ) : (
                  <button 
                    className="add-section-button"
                    onClick={() => setIsAddingSectionName(true)}
                  >
                    <FiPlus /> Add New Section
                  </button>
                )}
              </div>
              
              <div className="saved-jobs-list">
                {loading ? (
                  <div className="loading-container">Loading saved jobs...</div>
                ) : savedJobs.length === 0 ? (
                  <div className="no-jobs-message">No saved jobs found</div>
                ) : (
                  savedJobs.map(job => (
                    <div key={job.id} className="job-card">
                      <div className="job-header">
                        <h3 className="job-title">{job.title}</h3>
                        <div className="job-actions">
                          <div className="job-sections-dropdown">
                            <button className="sections-dropdown-button">
                              <FiBookmark /> Organize
                            </button>
                            <div className="sections-dropdown-content">
                              {savedJobSections.slice(1).map(section => (
                                <div key={section.id} className="section-checkbox">
                                  <label>
                                    <input
                                      type="checkbox"
                                      checked={job.sectionIds.includes(section.id)}
                                      onChange={(e) => moveJobToSection(job.id, section.id, e.target.checked)}
                                    />
                                    {section.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                          <button 
                            className="delete-job-button" 
                            onClick={() => handleDeleteSavedJob(job.id)}
                            title="Remove from saved jobs"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                      <div className="job-company">{job.company}</div>
                      <div className="job-details">
                        <span className="job-location">{job.location}</span>
                        <span className="job-salary">{job.salary}</span>
                      </div>
                      <div className="job-tags">
                        {job.tags.map((tag, index) => (
                          <span key={index} className="job-tag">{tag}</span>
                        ))}
                      </div>
                      <p className="job-description">{job.description}</p>
                      <div className="job-footer">
                        <span className="job-posted">Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                        <button className="apply-button">
                          Apply <FiExternalLink className="apply-icon" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeekerJobs; 