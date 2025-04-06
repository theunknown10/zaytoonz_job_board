import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa';
import './SeekerAuth.css';

const SeekerAuth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('signin');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form states
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });
  
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  
  // Form validation states
  const [signInErrors, setSignInErrors] = useState({});
  const [signUpErrors, setSignUpErrors] = useState({});
  
  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInData({
      ...signInData,
      [name]: value
    });
    // Clear error when user types
    if (signInErrors[name]) {
      setSignInErrors({
        ...signInErrors,
        [name]: ''
      });
    }
  };
  
  const handleSignUpChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignUpData({
      ...signUpData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error when user types
    if (signUpErrors[name]) {
      setSignUpErrors({
        ...signUpErrors,
        [name]: ''
      });
    }
  };
  
  const validateSignIn = () => {
    const errors = {};
    
    if (!signInData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signInData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!signInData.password) {
      errors.password = 'Password is required';
    }
    
    setSignInErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validateSignUp = () => {
    const errors = {};
    
    if (!signUpData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!signUpData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signUpData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!signUpData.password) {
      errors.password = 'Password is required';
    } else if (signUpData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (!signUpData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (signUpData.password !== signUpData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!signUpData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the Privacy Policy';
    }
    
    setSignUpErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSignIn = async (e) => {
    e.preventDefault();
    
    if (!validateSignIn()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Mock API call
      // In a real application, you would call your authentication API here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store authentication token in localStorage or cookie
      localStorage.setItem('seekerAuth', 'true');
      
      // Redirect to seeker dashboard
      navigate('/seeker');
      
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!validateSignUp()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Mock API call
      // In a real application, you would call your registration API here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store authentication token in localStorage or cookie
      localStorage.setItem('seekerAuth', 'true');
      
      // Redirect to seeker dashboard
      navigate('/seeker');
      
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const goBack = () => {
    navigate('/');
  };
  
  return (
    <div className="seeker-auth-container">
      <div className="auth-back-button" onClick={goBack}>
        <FaArrowLeft /> Back to home
      </div>
      
      <div className="auth-content">
        <div className="auth-header">
          <h1>Job Seeker Portal</h1>
          <p>Sign in to access job opportunities and manage your career</p>
        </div>
        
        <div className="auth-tabs">
          <button 
            className={`tab-button ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => setActiveTab('signin')}
          >
            Sign In
          </button>
          <button 
            className={`tab-button ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>
        
        <div className="auth-form-container">
          {activeTab === 'signin' ? (
            <form className="auth-form" onSubmit={handleSignIn}>
              {error && <div className="auth-error">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="signin-email">
                  <FaEnvelope className="input-icon" />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  id="signin-email"
                  name="email"
                  value={signInData.email}
                  onChange={handleSignInChange}
                  placeholder="Enter your email"
                />
                {signInErrors.email && <div className="field-error">{signInErrors.email}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="signin-password">
                  <FaLock className="input-icon" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  id="signin-password"
                  name="password"
                  value={signInData.password}
                  onChange={handleSignInChange}
                  placeholder="Enter your password"
                />
                {signInErrors.password && <div className="field-error">{signInErrors.password}</div>}
              </div>
              
              <div className="form-footer">
                <button type="submit" className="auth-button" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
                <div className="auth-links">
                  <a href="#forgot-password">Forgot Password?</a>
                </div>
              </div>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleSignUp}>
              {error && <div className="auth-error">{error}</div>}
              
              <div className="form-group">
                <label htmlFor="signup-fullname">
                  <FaUser className="input-icon" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  id="signup-fullname"
                  name="fullName"
                  value={signUpData.fullName}
                  onChange={handleSignUpChange}
                  placeholder="Enter your full name"
                />
                {signUpErrors.fullName && <div className="field-error">{signUpErrors.fullName}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="signup-email">
                  <FaEnvelope className="input-icon" />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  value={signUpData.email}
                  onChange={handleSignUpChange}
                  placeholder="Enter your email"
                />
                {signUpErrors.email && <div className="field-error">{signUpErrors.email}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="signup-password">
                  <FaLock className="input-icon" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  id="signup-password"
                  name="password"
                  value={signUpData.password}
                  onChange={handleSignUpChange}
                  placeholder="Create a password"
                />
                {signUpErrors.password && <div className="field-error">{signUpErrors.password}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="signup-confirm-password">
                  <FaLock className="input-icon" />
                  <span>Confirm Password</span>
                </label>
                <input
                  type="password"
                  id="signup-confirm-password"
                  name="confirmPassword"
                  value={signUpData.confirmPassword}
                  onChange={handleSignUpChange}
                  placeholder="Confirm your password"
                />
                {signUpErrors.confirmPassword && <div className="field-error">{signUpErrors.confirmPassword}</div>}
              </div>
              
              <div className="form-group checkbox-group">
                <label htmlFor="agree-terms" className="checkbox-label">
                  <input
                    type="checkbox"
                    id="agree-terms"
                    name="agreeToTerms"
                    checked={signUpData.agreeToTerms}
                    onChange={handleSignUpChange}
                  />
                  <span>I agree to the </span>
                  <a href="#privacy" onClick={(e) => {
                    e.preventDefault();
                    setShowPrivacyModal(true);
                  }}>Privacy Policy</a>
                </label>
                {signUpErrors.agreeToTerms && <div className="field-error">{signUpErrors.agreeToTerms}</div>}
              </div>
              
              <div className="form-footer">
                <button type="submit" className="auth-button" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      
      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="privacy-modal-overlay">
          <div className="privacy-modal">
            <div className="privacy-modal-header">
              <h2>Privacy Policy</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowPrivacyModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="privacy-modal-content">
              <h3>1. Information We Collect</h3>
              <p>We collect information that you provide directly to us, such as your name, email address, and resume information. We also collect information automatically when you use our service.</p>
              
              <h3>2. How We Use Your Information</h3>
              <p>We use your information to provide our services, to improve our platform, to communicate with you, and to match you with potential employers.</p>
              
              <h3>3. Information Sharing</h3>
              <p>We may share your information with employers when you apply for jobs, and with service providers who help us operate our platform.</p>
              
              <h3>4. Your Choices</h3>
              <p>You can access, update, or delete your account information at any time through your profile settings.</p>
              
              <h3>5. Security</h3>
              <p>We implement reasonable security measures to protect your personal information.</p>
              
              <h3>6. Changes to This Policy</h3>
              <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
            </div>
            <div className="privacy-modal-footer">
              <button 
                className="modal-button" 
                onClick={() => setShowPrivacyModal(false)}
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeekerAuth; 