import React, { useState } from 'react';
import { FiMenu, FiBell, FiUsers, FiUserPlus } from 'react-icons/fi';
import Sidebar from '../Sidebar';
import AddAdmin from './AddAdmin';
import AdminList from './AdminList';
import './AdminManagement.css';

const AdminManagement = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'list'

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="admin-layout">
      <Sidebar className={isMobileSidebarOpen ? 'open' : ''} />
      
      <div className="admin-main">
        <header className="admin-header">
          <button className="mobile-menu-toggle" onClick={toggleMobileSidebar}>
            <FiMenu />
          </button>
          <h1>Admin Management</h1>
          <div className="header-actions">
            <button className="notifications-button">
              <FiBell />
            </button>
          </div>
        </header>
        
        <div className="admin-content">
          <div className="admin-management-container">
            <div className="tabs-container">
              <button 
                className={`tab ${activeTab === 'add' ? 'active' : ''}`}
                onClick={() => setActiveTab('add')}
              >
                <FiUserPlus className="tab-icon" />
                Add Admin
              </button>
              <button 
                className={`tab ${activeTab === 'list' ? 'active' : ''}`}
                onClick={() => setActiveTab('list')}
              >
                <FiUsers className="tab-icon" />
                Admin List
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'add' ? <AddAdmin /> : <AdminList />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement; 