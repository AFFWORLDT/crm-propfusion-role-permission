import { format, addHours, parseISO, formatDistanceToNow } from 'date-fns';

/**
 * Format date and time to GMT+4 (Dubai timezone)
 * @param {string|Date} dateInput - Date string or Date object
 * @param {string} formatString - Format string for date-fns
 * @returns {string} Formatted date/time string in GMT+4
 */
export const formatToGMT4 = (dateInput, formatString = 'dd MMM yyyy h:mm a') => {
  try {
    let date;
    
    if (typeof dateInput === 'string') {
      date = parseISO(dateInput);
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      console.warn('Invalid date input:', dateInput);
      return 'Invalid Date';
    }
    
    // Add 4 hours for GMT+4 (Dubai timezone)
    const gmt4Date = addHours(date, 4);
    
    return format(gmt4Date, formatString);
  } catch (error) {
    console.error('Error formatting date to GMT+4:', error);
    return 'Invalid Date';
  }
};

/**
 * Format date to GMT+4 with time ago
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {object} Object with formatted date, time, and time ago
 */
export const formatDateTimeWithAgo = (dateInput) => {
  try {
    let date;
    
    if (typeof dateInput === 'string') {
      date = parseISO(dateInput);
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      return {
        date: 'Invalid Date',
        time: 'Invalid Date',
        timeAgo: 'Invalid Date'
      };
    }
    
    // Add 4 hours for GMT+4
    const gmt4Date = addHours(date, 4);
    
    return {
      date: format(gmt4Date, 'dd MMM yyyy'),
      time: format(gmt4Date, 'h:mm a'),
      timeAgo: formatDistanceToNow(gmt4Date, { addSuffix: true })
    };
  } catch (error) {
    console.error('Error formatting date with time ago:', error);
    return {
      date: 'Invalid Date',
      time: 'Invalid Date',
      timeAgo: 'Invalid Date'
    };
  }
};

/**
 * Truncate title to maximum 5 words
 * @param {string} title - Title string to truncate
 * @param {number} maxWords - Maximum number of words (default: 5)
 * @returns {string} Truncated title
 */
export const truncateTitle = (title, maxWords = 5) => {
  if (!title || typeof title !== 'string') {
    return 'Untitled';
  }
  
  const words = title.trim().split(/\s+/);
  
  if (words.length <= maxWords) {
    return title;
  }
  
  return words.slice(0, maxWords).join(' ') + '...';
};

/**
 * Format error message for toast display
 * @param {Error|string|object} error - Error object, string, or any error data
 * @returns {string} Formatted error message
 */
export const formatErrorMessage = (error) => {
  if (!error) {
    return 'An unknown error occurred';
  }
  
  // If it's already a string
  if (typeof error === 'string') {
    return error;
  }
  
  // If it's an Error object
  if (error instanceof Error) {
    return error.message || error.name || 'An error occurred';
  }
  
  // If it's an object with message property
  if (error && typeof error === 'object' && error.message) {
    return error.message;
  }
  
  // If it's an object with error property
  if (error && typeof error === 'object' && error.error) {
    return error.error;
  }
  
  // If it's an object with data property
  if (error && typeof error === 'object' && error.data) {
    if (typeof error.data === 'string') {
      return error.data;
    }
    if (error.data && typeof error.data === 'object' && error.data.message) {
      return error.data.message;
    }
  }
  
  // If it's an object with response property (axios error)
  if (error && typeof error === 'object' && error.response) {
    if (error.response.data && typeof error.response.data === 'string') {
      return error.response.data;
    }
    if (error.response.data && typeof error.response.data === 'object' && error.response.data.message) {
      return error.response.data.message;
    }
    if (error.response.statusText) {
      return `${error.response.status}: ${error.response.statusText}`;
    }
    if (error.response.status) {
      return `Request failed with status ${error.response.status}`;
    }
  }
  
  // If it's an object with status property
  if (error && typeof error === 'object' && error.status) {
    return `Request failed with status ${error.status}`;
  }
  
  // Fallback: try to convert to string
  try {
    const errorString = JSON.stringify(error);
    if (errorString && errorString !== '{}') {
      return errorString;
    }
  } catch (e) {
    // Ignore JSON.stringify errors
  }
  
  return 'An unexpected error occurred';
};

/**
 * Format date for table display in GMT+4
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {string} Formatted date string
 */
export const formatTableDate = (dateInput) => {
  return formatToGMT4(dateInput, 'dd/MM/yyyy h:mm a');
};

/**
 * Format time only in GMT+4
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {string} Formatted time string
 */
export const formatTimeOnly = (dateInput) => {
  return formatToGMT4(dateInput, 'h:mm a');
};

/**
 * Format date only in GMT+4
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {string} Formatted date string
 */
export const formatDateOnly = (dateInput) => {
  return formatToGMT4(dateInput, 'dd MMM yyyy');
};

/**
 * Test function to verify all utilities are working correctly
 * @returns {object} Test results
 */
export const testFormatUtils = () => {
  const testDate = '2024-01-15T10:30:00Z';
  const testTitle = 'This is a very long property title that should be truncated to five words maximum';
  const testError = new Error('Test error message');
  
  return {
    gmt4Format: formatToGMT4(testDate),
    truncatedTitle: truncateTitle(testTitle),
    errorMessage: formatErrorMessage(testError),
    originalTitle: testTitle,
    originalDate: testDate
  };
}; 