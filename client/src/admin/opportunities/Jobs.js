import React, { useState } from 'react';
import '../AdminLayout.css';
import './Jobs.css';
import { FiPlus, FiList, FiBriefcase } from 'react-icons/fi';
import AddResource from './AddResource';
import ListResources from './ListResources';
import ListOpportunities from './ListOpportunities';

const Jobs = () => {
  const [activeTab, setActiveTab] = useState('add');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'add':
        return <AddResource />;
      case 'listResources':
        return <ListResources />;
      case 'listOpportunities':
        return <ListOpportunities />;
      default:
        return null;
    }
  };

  return (
    <div className="jobs-container">
      <h2 className="page-title">Jobs Management</h2>
      
      <div className="dashboard-welcome">
        <p>
          Manage job resources and opportunities. Add new job resources, view existing resources, and manage job opportunities.
        </p>
      </div>
      
      <div className="admin-tabs">
        <button 
          className={`admin-tab-button ${activeTab === 'add' ? 'active' : ''}`} 
          onClick={() => setActiveTab('add')}
        >
          <FiPlus className="admin-tab-icon" />
          Add Resources
        </button>
        <button 
          className={`admin-tab-button ${activeTab === 'listResources' ? 'active' : ''}`} 
          onClick={() => setActiveTab('listResources')}
        >
          <FiList className="admin-tab-icon" />
          List Resources
        </button>
        <button 
          className={`admin-tab-button ${activeTab === 'listOpportunities' ? 'active' : ''}`} 
          onClick={() => setActiveTab('listOpportunities')}
        >
          <FiBriefcase className="admin-tab-icon" />
          List Opportunities
        </button>
      </div>
      
      <div className="admin-tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Jobs; 