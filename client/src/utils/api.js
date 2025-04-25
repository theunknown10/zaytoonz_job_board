/**
 * API utility file for making fetch requests to the backend
 */

// Get the API URL from environment variables or use a default
const API_URL = process.env.REACT_APP_API_URL || '';

/**
 * Makes a fetch request to the API with the correct base URL
 * @param {string} endpoint - The API endpoint (should start with /)
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise} - The fetch promise
 */
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  // Set default headers if not provided
  if (!options.headers) {
    options.headers = {
      'Content-Type': 'application/json',
    };
  }
  
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    console.error(`API call error for ${endpoint}:`, error);
    throw error;
  }
};

export default apiCall; 