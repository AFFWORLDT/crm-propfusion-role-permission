import { getApiUrl } from '../utils/getApiUrl';

/**
 * Register a new owner publicly
 * @param {Object} ownerData - Owner registration data
 * @returns {Promise} API response
 */
export const registerOwner = async (ownerData) => {
  try {
    const response = await fetch(`${getApiUrl()}/owners/public`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(ownerData),
      // Note: No Authorization header for public registration
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Owner registration error:', error);
    throw error;
  }
};

/**
 * Check if email is already registered
 * @param {string} email - Email to check
 * @returns {Promise} API response
 */
export const checkOwnerEmailAvailability = async (email) => {
  try {
    const response = await fetch(`${getApiUrl()}/owners/check-email?email=${encodeURIComponent(email)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to check email availability');
    }

    return await response.json();
  } catch (error) {
    console.error('Email check error:', error);
    throw error;
  }
};

/**
 * Get registration status
 * @param {string} email - Email to check status
 * @returns {Promise} API response
 */
export const getOwnerRegistrationStatus = async (email) => {
  try {
    const response = await fetch(`${getApiUrl()}/owners/registration-status?email=${encodeURIComponent(email)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to get registration status');
    }

    return await response.json();
  } catch (error) {
    console.error('Status check error:', error);
    throw error;
  }
}; 