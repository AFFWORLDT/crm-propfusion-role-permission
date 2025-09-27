// Common chart theme
export const chartTheme = {
    mode: 'light',
    palette: 'palette1',
    monochrome: {
        enabled: false,
        color: '#341b80',
        shadeTo: 'light',
        shadeIntensity: 0.65
    }
};

// Function to prepare CSV data
export const prepareCSVData = (data, title) => {
    // Check if data is valid
    if (!data || !Array.isArray(data) || data.length === 0) {
        return null;
    }
    
    // Ensure data is an array of objects
    const formattedData = data.map(item => {
        // If item is already an object, return it
        if (typeof item === 'object' && item !== null) {
            return item;
        }
        // Otherwise, create an object
        return { value: item };
    });
    
    // Create headers from the first object's keys
    const headers = Object.keys(formattedData[0]).map(key => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        key
    }));
    
    return {
        data: formattedData,
        headers,
        filename: `${title.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`
    };
}; 