import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { FiClock, FiDollarSign } from 'react-icons/fi';
import Jobs from './Jobs';
import '../AdminLayout.css';

// Placeholder components with consistent styling
const Trainings = () => (
  <div className="jobs-container">
    <h2 className="page-title">Trainings Management</h2>
    <div className="admin-tab-content" style={{ textAlign: 'center', padding: '50px 30px' }}>
      <FiClock style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '20px' }} />
      <h3>Coming Soon</h3>
      <p>The Trainings Management section is under development.</p>
    </div>
  </div>
);

const Funding = () => (
  <div className="jobs-container">
    <h2 className="page-title">Funding Management</h2>
    <div className="admin-tab-content" style={{ textAlign: 'center', padding: '50px 30px' }}>
      <FiDollarSign style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '20px' }} />
      <h3>Coming Soon</h3>
      <p>The Funding Management section is under development.</p>
    </div>
  </div>
);

const Opportunities = () => {
  return (
    <Routes>
      <Route path="jobs" element={<Jobs />} />
      <Route path="trainings" element={<Trainings />} />
      <Route path="funding" element={<Funding />} />
      <Route path="*" element={<Navigate to="jobs" replace />} />
    </Routes>
  );
};

export default Opportunities; 