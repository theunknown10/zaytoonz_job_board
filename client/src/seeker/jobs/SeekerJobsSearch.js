import React, { useState } from 'react';
import { FiMenu, FiBell, FiSearch } from 'react-icons/fi';
import SeekerSidebar from '../SeekerSidebar';
import '../Dashboard.css';

const SeekerJobsSearch = () => {
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
          <h1>Jobs Search</h1>
          <div className="header-actions">
            <button className="notifications-button">
              <FiBell />
            </button>
          </div>
        </header>
        
        <div className="seeker-content">
          <div className="dashboard-welcome">
            <h2>Find Your Next Opportunity</h2>
            <p>
              Browse and search through available job opportunities that match your skills and career goals.
              Filter by industry, location, job type, and more to find the perfect position.
            </p>
          </div>
          
          <div className="dashboard-panel" style={{ textAlign: 'center', padding: '50px 30px' }}>
            <FiSearch style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '20px' }} />
            <h3>Coming Soon</h3>
            <p>The Jobs Search feature is under development.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerJobsSearch; 