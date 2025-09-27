import axiosInstance from "../utils/axiosInstance";

// Get all jobs
export const getJobs = async () => {
    try {
        const response = await axiosInstance.get("/jobs");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get a single job by ID
export const getJob = async (id) => {
    try {
        const response = await axiosInstance.get(`/jobs/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Create a new job
export const createJob = async (jobData) => {
    try {
        // Convert data to URL-encoded format
        const formData = new URLSearchParams();
        Object.keys(jobData).forEach(key => {
            formData.append(key, jobData[key]);
        });
        
        const response = await axiosInstance.post("/jobs", formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update an existing job
export const updateJob = async (id, jobData) => {
    try {
        // Convert data to URL-encoded format
        const formData = new URLSearchParams();
        Object.keys(jobData).forEach(key => {
            formData.append(key, jobData[key]);
        });
        
        const response = await axiosInstance.put(`/jobs/${id}`, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete a job
export const deleteJob = async (id) => {
    try {
        const response = await axiosInstance.delete(`/jobs/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get jobs by status
export const getJobsByStatus = async (status) => {
    try {
        const response = await axiosInstance.get(`/jobs?status=${status}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get jobs by category
export const getJobsByCategory = async (category) => {
    try {
        const response = await axiosInstance.get(`/jobs?category=${category}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Search jobs
export const searchJobs = async (query) => {
    try {
        const response = await axiosInstance.get(`/jobs?search=${query}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
