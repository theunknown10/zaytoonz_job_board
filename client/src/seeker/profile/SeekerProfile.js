import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaBriefcase, FaBell, FaRegFilePdf } from 'react-icons/fa';
import { FiMenu, FiBell } from 'react-icons/fi';
import './SeekerProfile.css';

// Import components
import ProfileDashboard from './ProfileDashboard';
import RecentActivity from './components/RecentActivity';
import SeekerSidebar from '../SeekerSidebar';

const SeekerProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  useEffect(() => {
    // Mock user data fetch - replace with actual API call
    setTimeout(() => {
      const userData = {
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        summary: 'Senior Software Developer with 5+ years of experience in full-stack web development',
        profileComplete: 85
      };
      
      setUser(userData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="seeker-layout">
        <SeekerSidebar className={isMobileSidebarOpen ? 'open' : ''} />
        <div className="seeker-main">
          <header className="seeker-header">
            <button className="mobile-menu-toggle" onClick={toggleMobileSidebar}>
              <FiMenu />
            </button>
            <h1>My Profile</h1>
            <div className="header-actions">
              <button className="notifications-button">
                <FiBell />
              </button>
            </div>
          </header>
          <div className="seeker-content">
            <div className="profile-loading">
              <div className="spinner"></div>
              <p>Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="seeker-layout">
      <SeekerSidebar className={isMobileSidebarOpen ? 'open' : ''} />
      <div className="seeker-main">
        <header className="seeker-header">
          <button className="mobile-menu-toggle" onClick={toggleMobileSidebar}>
            <FiMenu />
          </button>
          <h1>My Profile</h1>
          <div className="header-actions">
            <button className="notifications-button">
              <FiBell />
            </button>
          </div>
        </header>
        
        <div className="seeker-content">
          <div className="profile-header">
            <div className="profile-avatar">
              <FaUser />
            </div>
            <div className="profile-info">
              <h1>{user.name}</h1>
              <p className="profile-summary">{user.summary}</p>
              <div className="profile-meta">
                <span><i className="fa fa-envelope"></i> {user.email}</span>
                <span><i className="fa fa-phone"></i> {user.phone}</span>
                <span><i className="fa fa-map-marker"></i> {user.location}</span>
              </div>
              <div className="profile-completion">
                <div className="progress-label">
                  <span>Profile Completion</span>
                  <span>{user.profileComplete}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${user.profileComplete}%` }}></div>
                </div>
              </div>
            </div>
            <div className="profile-actions">
              <Link to="/seeker/profile/edit" className="btn">Edit Profile</Link>
            </div>
          </div>
          
          {/* Overview Dashboard */}
          <ProfileDashboard />
          
          {/* Recent Activity */}
          <RecentActivity />
          
          {/* Quick Links */}
          <div className="profile-quick-links">
            <h3>Quick Links</h3>
            <div className="quick-links-grid">
              <Link to="/seeker/cv-maker" className="quick-link">
                <FaRegFilePdf />
                <span>My CV</span>
              </Link>
              <Link to="/seeker/jobs" className="quick-link">
                <FaBriefcase />
                <span>Job Board</span>
              </Link>
              <Link to="/seeker/jobs/alerts" className="quick-link">
                <FaBell />
                <span>Job Alerts</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerProfile; 