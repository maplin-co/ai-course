/**
 * Centralized API configuration
 * This ensures we only need to update the API base URL in one place
 */

export const API_BASE = (process.env.REACT_APP_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:8080' : window.location.origin)).replace(/\/$/, '');

export default API_BASE;
