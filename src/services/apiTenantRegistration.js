import { getApiUrl } from '../utils/getApiUrl';

/**
 * Register a new tenant publicly
 * @param {Object} tenantData - Tenant registration data
 * @returns {Promise} API response
 */
export const registerTenant = async (tenantData) => {
  try {
    const response = await fetch(`${getApiUrl()}/tenants/public`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(tenantData),
      // Note: No Authorization header for public registration
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Tenant registration error:', error);
    throw error;
  }
};

/**
 * Check if email is already registered
 * @param {string} email - Email to check
 * @returns {Promise} API response
 */
export const checkTenantEmailAvailability = async (email) => {
  try {
    const response = await fetch(`${getApiUrl()}/tenants/check-email?email=${encodeURIComponent(email)}`, {
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
export const getTenantRegistrationStatus = async (email) => {
  try {
    const response = await fetch(`${getApiUrl()}/tenants/registration-status?email=${encodeURIComponent(email)}`, {
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