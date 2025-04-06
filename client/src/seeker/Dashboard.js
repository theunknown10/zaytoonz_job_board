import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import SeekerSidebar from './SeekerSidebar';
import { FiMenu, FiBell } from 'react-icons/fi';

const SeekerDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/seeker/dashboard');
        const data = await response.json();
        
        if (data.status === 'success') {
          setDashboardData(data.data);
        } else {
          setError(data.message || 'Failed to fetch dashboard data');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="seeker-layout">
      <SeekerSidebar className={isMobileSidebarOpen ? 'open' : ''} />
      
      <div className="seeker-main">
        <header className="seeker-header">
          <button className="mobile-menu-toggle" onClick={toggleMobileSidebar}>
            <FiMenu />
          </button>
          <h1>Job Seeker Dashboard</h1>
          <div className="header-actions">
            <button className="notifications-button">
              <FiBell />
            </button>
          </div>
        </header>
        
        <div className="seeker-content">
          <div className="dashboard-welcome">
            <h2>Welcome to Your Career Portal</h2>
            <p>
              Discover job opportunities, track your applications, and manage your professional profile.
              Use the panels below to navigate through different features.
            </p>
          </div>
          
          {loading ? (
            <p>Loading dashboard data...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="dashboard-grid">
              <div className="dashboard-panel">
                <h3>Job Search</h3>
                <p>Browse available positions matching your skills and experience.</p>
              </div>
              <div className="dashboard-panel">
                <h3>My Applications</h3>
                <p>Track status of submitted job applications.</p>
              </div>
              <div className="dashboard-panel">
                <h3>Profile</h3>
                <p>Update your resume, skills, and professional information.</p>
              </div>
              <div className="dashboard-panel">
                <h3>Saved Jobs</h3>
                <p>View and manage your saved job listings.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard; 