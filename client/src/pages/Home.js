import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleProfileClick = (profile) => {
    if (profile === 'seeker') {
      navigate('/seeker/auth');
    } else {
      navigate(`/${profile}`);
    }
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Global Talent Connect</h1>
        <p className="home-subtitle">
          The premier platform connecting talented professionals with world-class companies. 
          Select your profile to get started.
        </p>
      </div>
      <div className="profile-grid">
        <div 
          className="profile-square admin" 
          onClick={() => handleProfileClick('admin')}
        >
          <div className="profile-content">
            <div className="profile-icon">👑</div>
            <h2>Admin</h2>
            <p>Manage the platform, users, and analytics</p>
          </div>
        </div>
        <div 
          className="profile-square recruiter" 
          onClick={() => handleProfileClick('recruiter')}
        >
          <div className="profile-content">
            <div className="profile-icon">🔍</div>
            <h2>Recruiter</h2>
            <p>Post jobs and find the perfect candidates</p>
          </div>
        </div>
        <div 
          className="profile-square seeker" 
          onClick={() => handleProfileClick('seeker')}
        >
          <div className="profile-content">
            <div className="profile-icon">💼</div>
            <h2>Job Seeker</h2>
            <p>Discover opportunities and advance your career</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 