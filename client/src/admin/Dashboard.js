import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import './AdminLayout.css';
import { 
  FiUsers, 
  FiFileText, 
  FiBarChart2, 
  FiSettings 
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
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
    <div className="admin-dashboard">
      <div className="dashboard-welcome">
        <h2>Welcome to the Admin Portal</h2>
        <p>
          Manage your organization's job board, users, and analytics from this central dashboard.
          Use the panels below to access different administrative functions.
        </p>
      </div>
      
      {loading ? (
        <p>Loading dashboard data...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="dashboard-grid">
          <div className="dashboard-panel">
            <div className="panel-icon"><FiUsers /></div>
            <h3>User Management</h3>
            <p>Manage recruiters and job seekers on the platform.</p>
          </div>
          <div className="dashboard-panel">
            <div className="panel-icon"><FiFileText /></div>
            <h3>Job Listings</h3>
            <p>Review and approve job postings.</p>
          </div>
          <div className="dashboard-panel">
            <div className="panel-icon"><FiBarChart2 /></div>
            <h3>Analytics</h3>
            <p>View platform usage and performance metrics.</p>
          </div>
          <div className="dashboard-panel">
            <div className="panel-icon"><FiSettings /></div>
            <h3>Settings</h3>
            <p>Configure platform settings and preferences.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 