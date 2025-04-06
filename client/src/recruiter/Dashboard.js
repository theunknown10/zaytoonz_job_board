import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/recruiter/dashboard');
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

  return (
    <div className="dashboard-container recruiter-dashboard">
      <header className="dashboard-header">
        <div className="dashboard-logo">
          <span className="dashboard-logo-icon">🔍</span>
          <h1>Recruiter Dashboard</h1>
        </div>
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </header>
      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h2>Welcome to the Recruiter Portal</h2>
          <p>
            Post job opportunities, find candidates, and manage hiring processes all from this central dashboard.
            Use the panels below to access different recruiter functions.
          </p>
        </div>
        
        {loading ? (
          <p>Loading dashboard data...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="dashboard-grid">
            <div className="dashboard-panel">
              <h3>Post a Job</h3>
              <p>Create and publish new job listings to find qualified candidates.</p>
            </div>
            <div className="dashboard-panel">
              <h3>Active Listings</h3>
              <p>Manage your current job postings and applications.</p>
            </div>
            <div className="dashboard-panel">
              <h3>Candidate Search</h3>
              <p>Search for qualified candidates in our database.</p>
            </div>
            <div className="dashboard-panel">
              <h3>Messages</h3>
              <p>Communicate with applicants and manage your inbox.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard; 