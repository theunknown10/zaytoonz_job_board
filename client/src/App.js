import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import components
import Home from './pages/Home';
import AdminDashboard from './admin/Dashboard';
import AdminLayout from './admin/AdminLayout';
import Opportunities from './admin/opportunities/Opportunities';
import AdminManagement from './admin/management/AdminManagement';
import RecruiterDashboard from './recruiter/Dashboard';
import SeekerDashboard from './seeker/Dashboard';
import SeekerProfile from './seeker/profile/SeekerProfile';
import SeekerCVMaker from './seeker/SeekerCVMaker';
import SeekerJobsAlerts from './seeker/jobs/SeekerJobsAlerts';
import SeekerJobsSearch from './seeker/jobs/SeekerJobsSearch';
import SeekerJobs from './seeker/jobs/SeekerJobs';
import SeekerResources from './seeker/SeekerResources';
import SeekerAuth from './auth/SeekerAuth';

// Protected route component
const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('seekerAuth') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/seeker/auth" replace />;
  }
  
  return element;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Admin routes with AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="opportunities/*" element={<Opportunities />} />
          <Route path="management" element={<AdminManagement />} />
        </Route>
        
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        
        {/* Seeker auth route */}
        <Route path="/seeker/auth" element={<SeekerAuth />} />
        
        {/* Protected seeker routes */}
        <Route path="/seeker" element={<ProtectedRoute element={<SeekerDashboard />} />} />
        <Route path="/seeker/profile" element={<ProtectedRoute element={<SeekerProfile />} />} />
        <Route path="/seeker/cv-maker" element={<ProtectedRoute element={<SeekerCVMaker />} />} />
        <Route path="/seeker/jobs/alerts" element={<ProtectedRoute element={<SeekerJobsAlerts />} />} />
        <Route path="/seeker/jobs/search" element={<ProtectedRoute element={<SeekerJobsSearch />} />} />
        <Route path="/seeker/jobs" element={<ProtectedRoute element={<SeekerJobs />} />} />
        <Route path="/seeker/resources" element={<ProtectedRoute element={<SeekerResources />} />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
