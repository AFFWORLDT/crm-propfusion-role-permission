import axiosInstance from "../utils/axiosInstance";

// Get all property requirements
export async function getPropertyRequirements(filters = {}) {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value);
        }
    });

    const url = `/property-requirements${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    try {
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching property requirements:", error);
        throw error;
    }
}

// Get property requirement by ID
export async function getPropertyRequirementById(requirementId) {
    try {
        const response = await axiosInstance.get(`/property-requirements/${requirementId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching property requirement:", error);
        throw error;
    }
}

// Create new property requirement
export async function createPropertyRequirement(requirementData) {
    try {
        const response = await axiosInstance.post('/property-requirements', requirementData);
        return response.data;
    } catch (error) {
        console.error("Error creating property requirement:", error);
        throw error;
    }
}

// Update property requirement
export async function updatePropertyRequirement(requirementId, requirementData) {
    try {
        const response = await axiosInstance.put(`/property-requirements/${requirementId}`, requirementData);
        return response.data;
    } catch (error) {
        console.error("Error updating property requirement:", error);
        throw error;
    }
}

// Delete property requirement
export async function deletePropertyRequirement(requirementId) {
    try {
        const response = await axiosInstance.delete(`/property-requirements/${requirementId}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error deleting property requirement:", error);
        throw error;
    }
}
