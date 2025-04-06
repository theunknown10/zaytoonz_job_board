/**
 * API Configuration
 * 
 * This file contains the configuration for API endpoints
 * It uses environment variables to determine the base URL
 */

// Use the environment variable in production, fallback to proxy in development
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

/**
 * Creates a full URL for an API endpoint
 * @param {string} endpoint - The API endpoint path
 * @returns {string} The full URL
 */
export const apiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

export default {
  // Auth endpoints
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
  },
  
  // Admin endpoints
  admin: {
    dashboard: '/api/admin/dashboard',
    resources: '/api/admin/resources/jobs',
    opportunities: '/api/admin/opportunities',
    scrape: '/api/admin/resources/api/jobs/scrape',
    scrapeResults: '/api/admin/resources/api/scrape-results',
  },
  
  // Seeker endpoints
  seeker: {
    jobs: '/api/seeker/jobs',
    profile: '/api/seeker/profile',
    cvs: '/api/seeker/cvs',
  }
}; 