import React, { useState, useEffect } from 'react';
import { FiMenu, FiBell, FiPlus, FiList } from 'react-icons/fi';
import SeekerSidebar from '../SeekerSidebar';
import AddJobAlert from './components/AddJobAlert';
import EditJobAlert from './components/EditJobAlert';
import ListJobAlerts from './components/ListJobAlerts';
import '../Dashboard.css';
import './SeekerJobsAlerts.css';

const SeekerJobsAlerts = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('list'); // 'add', 'edit', or 'list'
  const [alertToEdit, setAlertToEdit] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };
  
  const handleAddSuccess = () => {
    // Switch to list tab and refresh the list
    setActiveTab('list');
    setRefreshKey(prev => prev + 1);
  };
  
  const handleEditAlert = (alert) => {
    setAlertToEdit(alert);
    setActiveTab('edit');
  };
  
  const handleCancelEdit = () => {
    setAlertToEdit(null);
    setActiveTab('list');
  };

  return (
    <div className="seeker-layout">
      <SeekerSidebar className={isMobileSidebarOpen ? 'open' : ''} />
      
      <div className="seeker-main">
        <header className="seeker-header">
          <button className="mobile-menu-toggle" onClick={toggleMobileSidebar}>
            <FiMenu />
          </button>
          <h1>Job Alerts</h1>
          <div className="header-actions">
            <button className="notifications-button">
              <FiBell />
            </button>
          </div>
        </header>
        
        <div className="seeker-content">
          <div className="dashboard-welcome">
            <h2>Job Alerts</h2>
            <p>
              Set up personalized job alerts to receive notifications when new positions 
              matching your skills and preferences become available.
            </p>
          </div>
          
          <div className="alerts-tabs">
            <button 
              className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
              onClick={() => setActiveTab('list')}
            >
              <FiList className="tab-icon" />
              List Job Alerts
            </button>
            <button 
              className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
              onClick={() => {
                setAlertToEdit(null);
                setActiveTab('add');
              }}
            >
              <FiPlus className="tab-icon" />
              Add Job Alert
            </button>
          </div>
          
          {activeTab === 'add' && (
            <AddJobAlert 
              onSuccess={handleAddSuccess}
            />
          )}
          
          {activeTab === 'edit' && alertToEdit && (
            <EditJobAlert 
              alert={alertToEdit}
              onSuccess={handleAddSuccess}
              onCancel={handleCancelEdit}
            />
          )}
          
          {activeTab === 'list' && (
            <ListJobAlerts 
              onEdit={handleEditAlert}
              refresh={refreshKey}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SeekerJobsAlerts; 