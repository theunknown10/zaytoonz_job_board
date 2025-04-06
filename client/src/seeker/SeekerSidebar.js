import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SeekerSidebar.css';
// Import icons from react-icons
import { 
  FiUser, 
  FiFileText, 
  FiBriefcase, 
  FiBook, 
  FiLogOut,
  FiChevronDown,
  FiBell,
  FiSearch,
  FiBookmark
} from 'react-icons/fi';
import { FaHome, FaBriefcase as FaBriefcaseIcon, FaFileAlt, FaBook, FaUser } from 'react-icons/fa';

const routes = [
  {
    path: '/seeker/dashboard',
    name: 'Dashboard',
    icon: <FaHome />
  },
  {
    path: '/seeker/jobs',
    name: 'Job Board',
    icon: <FaBriefcaseIcon />
  },
  {
    path: '/seeker/cv',
    name: 'CV Builder',
    icon: <FaFileAlt />
  },
  {
    path: '/seeker/resources',
    name: 'Resources',
    icon: <FaBook />
  },
  {
    path: '/seeker/profile',
    name: 'My Profile',
    icon: <FaUser />
  }
];

const SeekerSidebar = ({ className }) => {
  const navigate = useNavigate();
  const [isJobsOpen, setIsJobsOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('/logo.png'); // Default logo

  const toggleJobs = () => {
    setIsJobsOpen(!isJobsOpen);
  };

  const handleLogout = () => {
    // Clear authentication token
    localStorage.removeItem('seekerAuth');
    
    // Redirect to auth page
    navigate('/seeker/auth');
  };

  return (
    <div className={`sidebar ${className || ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <img src={logoUrl} alt="Logo" className="logo" />
        </div>
        <h2 className="team-name">Seeker Dashboard</h2>
      </div>
      
      <div className="sidebar-menu">
        <button className="menu-item" onClick={() => navigate('/seeker/profile')}>
          <FiUser className="menu-icon" />
          Profile
        </button>
        
        <button className="menu-item" onClick={() => navigate('/seeker/cv-maker')}>
          <FiFileText className="menu-icon" />
          CV Maker
        </button>
        
        <div className="menu-item-with-submenu">
          <button 
            className={`menu-item ${isJobsOpen ? 'active' : ''}`} 
            onClick={toggleJobs}
          >
            <FiBriefcase className="menu-icon" />
            Jobs Management
            <FiChevronDown className={`dropdown-icon ${isJobsOpen ? 'open' : ''}`} />
          </button>
          
          {isJobsOpen && (
            <div className="submenu">
              <button className="submenu-item" onClick={() => navigate('/seeker/jobs/alerts')}>
                <FiBell className="submenu-icon" />
                Jobs Alerts
              </button>
              <button className="submenu-item" onClick={() => navigate('/seeker/jobs')}>
                <FiSearch className="submenu-icon" />
                Jobs
              </button>
            </div>
          )}
        </div>
        
        <button className="menu-item" onClick={() => navigate('/seeker/resources')}>
          <FiBook className="menu-icon" />
          Resources
        </button>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        <FiLogOut className="logout-icon" />
        Logout
      </button>
    </div>
  );
};

export default SeekerSidebar; 