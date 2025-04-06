import React, { useState } from 'react';
import { FiMenu, FiBell, FiUser } from 'react-icons/fi';
import SeekerSidebar from './SeekerSidebar';
import './Dashboard.css';

const SeekerProfile = () => {
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
          <h1>Profile</h1>
          <div className="header-actions">
            <button className="notifications-button">
              <FiBell />
            </button>
          </div>
        </header>
        
        <div className="seeker-content">
          <div className="dashboard-welcome">
            <h2>Your Profile</h2>
            <p>
              Manage your personal information, skills, experience, and preferences.
              A complete profile helps employers find you and increases your chances of getting hired.
            </p>
          </div>
          
          <div className="dashboard-panel" style={{ textAlign: 'center', padding: '50px 30px' }}>
            <FiUser style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '20px' }} />
            <h3>Coming Soon</h3>
            <p>The Profile Management section is under development.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerProfile; 