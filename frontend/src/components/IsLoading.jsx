import React from 'react';
import '../styles/is-loading.css';

const IsLoading = () => {
  return (
    <div className="loading-container">
      <div className="loading-wrapper">
        {/* Spinner */}
        <div className="loading-spinner">
          <div className="spinner-ring ring-1"></div>
          <div className="spinner-ring ring-2"></div>
          <div className="spinner-ring ring-3"></div>
          <div className="spinner-ring ring-4"></div>
          <div className="spinner-center">
            <span className="spinner-icon">👕</span>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="loading-text">
          <h3 className="loading-title">Loading</h3>
          <div className="loading-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
        
        {/* Loading Progress Bar */}
        <div className="loading-progress">
          <div className="progress-bar"></div>
        </div>
        
        {/* Brand Name */}
        <p className="loading-brand">Eco Green Tex Ltd.</p>
      </div>
    </div>
  );
};

export default IsLoading;