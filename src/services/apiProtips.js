import api from './api';

/**
 * Create a new protip
 * @param {Object} protipData - The protip data to send
 * @param {string} protipData.title
 * @param {string} protipData.content
 * @param {string} protipData.category
 * @param {string} protipData.difficulty_level
 * @param {number} protipData.order
 * @param {boolean} protipData.is_active
 * @returns {Promise<Object>} The created protip
 */
export const createProtip = (protipData) => {
  return api.post('/protips', protipData).then(res => res.data);
}; 