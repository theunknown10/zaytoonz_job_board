import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FiMenu, FiBell } from 'react-icons/fi';
import './Dashboard.css';
import './AdminLayout.css';

const AdminLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Admin Dashboard');
  const location = useLocation();

  useEffect(() => {
    // Set the page title based on the current route
    const path = location.pathname;
    if (path === '/admin') {
      setPageTitle('Admin Dashboard');
    } else if (path.includes('/admin/opportunities')) {
      setPageTitle('Opportunities Management');
    } else if (path.includes('/admin/management')) {
      setPageTitle('Admin Management');
    }
  }, [location]);

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
          <h1>{pageTitle}</h1>
          <div className="header-actions">
            <button className="notifications-button">
              <FiBell />
            </button>
          </div>
        </header>
        
        <div className="admin-content">
          {/* This will render the child route component */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 