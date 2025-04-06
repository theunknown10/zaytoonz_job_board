import React, { useState } from 'react';
import { FiMenu, FiBell, FiBook } from 'react-icons/fi';
import SeekerSidebar from './SeekerSidebar';
import './Dashboard.css';

const SeekerResources = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
          <h1>Resources</h1>
          <div className="header-actions">
            <button className="notifications-button">
              <FiBell />
            </button>
          </div>
        </header>
        
        <div className="seeker-content">
          <div className="dashboard-welcome">
            <h2>Career Resources</h2>
            <p>
              Access a variety of resources to help you in your job search and career development.
              Find guides, templates, and tips to enhance your professional journey.
            </p>
          </div>
          
          <div className="dashboard-panel" style={{ textAlign: 'center', padding: '50px 30px' }}>
            <FiBook style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '20px' }} />
            <h3>Coming Soon</h3>
            <p>The Resources section is under development.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerResources; 