import React from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';

const MainPage = () => {
  return (
    <div className="main-page-container">
      <h1>Hello World</h1>
      <div className="navigation-buttons">
        <Link to="/admin" className="nav-button admin-button">Admin</Link>
        <Link to="/seeker" className="nav-button seeker-button">Seeker</Link>
        <Link to="/sm" className="nav-button sm-button">SM</Link>
      </div>
    </div>
  );
};

export default MainPage; 