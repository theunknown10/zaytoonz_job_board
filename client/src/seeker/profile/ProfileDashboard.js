import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBookmark, FiBell, FiFileText, FiArrowRight } from 'react-icons/fi';
import './ProfileDashboard.css';

const ProfileDashboard = () => {
  const [profileStats, setProfileStats] = useState({
    savedJobs: 0,
    jobAlerts: 0,
    hasCV: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data for the dashboard
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Load saved jobs from localStorage
        const savedJobsData = localStorage.getItem('savedJobs');
        const savedJobs = savedJobsData ? JSON.parse(savedJobsData).length : 0;
        
        // Fetch job alerts count from API
        let jobAlerts = 0;
        try {
          const alertsResponse = await fetch('/api/seeker/job-alerts');
          if (alertsResponse.ok) {
            const alertsData = await alertsResponse.json();
            if (alertsData.status === 'success' && Array.isArray(alertsData.data)) {
              jobAlerts = alertsData.data.length;
            }
          }
        } catch (error) {
          console.error('Error fetching job alerts:', error);
        }
        
        // Check if CV exists (for now, just check localStorage)
        // In a real app, this would be fetched from the backend
        const hasCVData = localStorage.getItem('cv_data');
        const hasCV = !!hasCVData;
        
        // Update state with fetched data
        setProfileStats({
          savedJobs,
          jobAlerts,
          hasCV
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <div className="profile-dashboard">
      <h2 className="dashboard-title">Your Dashboard</h2>
      <p className="dashboard-description">
        Track your job search progress and manage your career tools
      </p>
      
      {loading ? (
        <div className="dashboard-loading">Loading your dashboard...</div>
      ) : (
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon saved-jobs-icon">
              <FiBookmark />
            </div>
            <div className="stat-content">
              <h3>Saved Jobs</h3>
              <div className="stat-number">{profileStats.savedJobs}</div>
              <p className="stat-description">Jobs you've saved for later</p>
              <Link to="/seeker/jobs" className="stat-action">
                View Jobs <FiArrowRight />
              </Link>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon job-alerts-icon">
              <FiBell />
            </div>
            <div className="stat-content">
              <h3>Job Alerts</h3>
              <div className="stat-number">{profileStats.jobAlerts}</div>
              <p className="stat-description">Active job search alerts</p>
              <Link to="/seeker/jobs/alerts" className="stat-action">
                Manage Alerts <FiArrowRight />
              </Link>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon cv-icon">
              <FiFileText />
            </div>
            <div className="stat-content">
              <h3>CV Status</h3>
              <div className="stat-status">
                {profileStats.hasCV ? 'CV Created' : 'No CV Yet'}
              </div>
              <p className="stat-description">
                {profileStats.hasCV 
                  ? 'Your CV is ready to share with employers' 
                  : 'Create your CV to apply for jobs faster'}
              </p>
              <Link to="/seeker/cv-maker" className="stat-action">
                {profileStats.hasCV ? 'Edit CV' : 'Create CV'} <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      )}
      
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <Link to="/seeker/jobs" className="action-button">
            Browse Jobs
          </Link>
          <Link to="/seeker/jobs/alerts" className="action-button">
            Create Job Alert
          </Link>
          <Link to="/seeker/cv-maker" className="action-button">
            Update CV
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard; 