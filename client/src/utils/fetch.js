/**
 * Fetch utility for making API requests
 * Uses the apiUrl helper to construct the full URL
 */

import { apiUrl } from '../config/api';

/**
 * Generic fetch function with error handling
 * 
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
export const fetchApi = async (endpoint, options = {}) => {
  // Set default headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Merge default headers with provided headers
  const headers = {
    ...defaultHeaders,
    ...(options.headers || {}),
  };

  // Construct the full URL
  const url = apiUrl(endpoint);

  // Make the request
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    // Check if the response is successful
    if (!response.ok) {
      // Try to parse error message from response
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      } catch (parseError) {
        throw new Error(`Request failed with status ${response.status}`);
      }
    }

    // Parse response data
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * GET request
 * 
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} Response data
 */
export const get = (endpoint, options = {}) => {
  return fetchApi(endpoint, {
    ...options,
    method: 'GET',
  });
};

/**
 * POST request
 * 
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} Response data
 */
export const post = (endpoint, data, options = {}) => {
  return fetchApi(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * PUT request
 * 
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} Response data
 */
export const put = (endpoint, data, options = {}) => {
  return fetchApi(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * DELETE request
 * 
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} Response data
 */
export const del = (endpoint, options = {}) => {
  return fetchApi(endpoint, {
    ...options,
    method: 'DELETE',
  });
}; 