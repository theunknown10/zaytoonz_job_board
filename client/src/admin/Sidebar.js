import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
// Import icons from react-icons
import { 
  FiGrid, 
  FiUser, 
  FiSettings, 
  FiBriefcase, 
  FiSearch, 
  FiUsers, 
  FiLogOut,
  FiEdit2,
  FiChevronDown
} from 'react-icons/fi';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpportunitiesOpen, setIsOpportunitiesOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('/logo.png'); // Default logo

  const toggleOpportunities = () => {
    setIsOpportunitiesOpen(!isOpportunitiesOpen);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    // Implement logout logic here
    navigate('/');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <img src={logoUrl} alt="Zaytoonz Logo" className="logo" />
          <div className="logo-upload">
            <label htmlFor="logo-input" className="logo-edit-btn">
              <FiEdit2 className="edit-icon" />
            </label>
            <input 
              type="file" 
              id="logo-input" 
              accept="image/*" 
              onChange={handleLogoUpload} 
              style={{ display: 'none' }}
            />
          </div>
        </div>
        <h3 className="team-name">Zaytoonz Team</h3>
      </div>

      <div className="sidebar-menu">
        <button className="menu-item" onClick={() => navigate('/admin/dashboard')}>
          <FiGrid className="menu-icon" />
          Dashboard
        </button>
        
        <button className="menu-item" onClick={() => navigate('/admin/profile')}>
          <FiUser className="menu-icon" />
          Profile Settings
        </button>
        
        <button className="menu-item" onClick={() => navigate('/admin/management')}>
          <FiSettings className="menu-icon" />
          Admin Management
        </button>
        
        <div className="menu-item-with-submenu">
          <button 
            className={`menu-item ${isOpportunitiesOpen ? 'active' : ''}`} 
            onClick={toggleOpportunities}
          >
            <FiBriefcase className="menu-icon" />
            Opportunities Management
            <FiChevronDown className={`dropdown-icon ${isOpportunitiesOpen ? 'open' : ''}`} />
          </button>
          
          {isOpportunitiesOpen && (
            <div className="submenu">
              <button className="submenu-item" onClick={() => navigate('/admin/opportunities/jobs')}>
                Jobs
              </button>
              <button className="submenu-item" onClick={() => navigate('/admin/opportunities/trainings')}>
                Trainings
              </button>
              <button className="submenu-item" onClick={() => navigate('/admin/opportunities/funding')}>
                Funding
              </button>
            </div>
          )}
        </div>
        
        <button className="menu-item" onClick={() => navigate('/admin/recruiters')}>
          <FiSearch className="menu-icon" />
          Recruiters
        </button>
        
        <button className="menu-item" onClick={() => navigate('/admin/seekers')}>
          <FiUsers className="menu-icon" />
          Seekers
        </button>
      </div>

      <button className="logout-button" onClick={handleLogout}>
        <FiLogOut className="logout-icon" />
        Logout
      </button>
    </div>
  );
};

export default Sidebar; 