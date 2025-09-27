import axios from "axios";
import Cookies from "universal-cookie";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

// Create an Axios instance with the base URL and default headers
const api = axios.create({
    baseURL: getApiUrl(),
    headers: {
        "Content-Type": "application/json",
    },
});

// Helper function to get the authorization headers
const getAuthHeaders = () => {
    const token = cookies.get("USER")?.access_token;
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {};
};

// Add Calendar Task
export const addCalendarTask = async (data) => {
    try {
        const response = await api.post("/calendar/tasks", data, {
            headers: {
                ...getAuthHeaders(),
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding calendar task:", error);
        throw error;
    }
};

// Get all Calendar Tasks
export const getCalendarTasks = async () => {
    try {
        const response = await api.get("/calendar/tasks", {
            headers: {
                ...getAuthHeaders(),
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching calendar tasks:", error);
        throw error;
    }
};

// Get Calendar Task by ID
export const getCalendarTaskById = async (id) => {
    try {
        const response = await api.get(`/calendar/tasks/${id}`, {
            headers: {
                ...getAuthHeaders(),
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching task with ID ${id}:`, error);
        throw error;
    }
};

// Update Calendar Task by ID
export const updateCalendarTaskById = async (id, data) => {
    try {
        const response = await api.put(`/calendar/tasks/${id}`, data, {
            headers: {
                ...getAuthHeaders(),
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating task with ID ${id}:`, error);
        throw error;
    }
};

// Delete Calendar Task by ID
export const deleteCalendarTaskById = async (id) => {
    try {
        const response = await api.delete(`/calendar/tasks/${id}`, {
            headers: {
                ...getAuthHeaders(),
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting task with ID ${id}:`, error);
        throw error;
    }
};

export const addCalendarEvent = async (data) => {
    try {
        const response = await api.post("/calendars/events", data, {
            headers: {
                ...getAuthHeaders(),
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding calendar task:", error);
        throw error;
    }
};

export const getCalendarEvent = async (filters = {}) => {
    try {
        const response = await api.get("/calendars/events", {
            headers: {
                ...getAuthHeaders(),
            },
            params: filters,
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching calendar tasks:", error);
        throw error;
    }
};

export const updateCalendarEvent = async (id, data, event_type) => {
    console.log("event_type", event_type);
    const update_all = event_type === "leave" ? true : false;
    try {
        const response = await api.put(`/calendars/events/${id}`, data, {
            headers: {
                ...getAuthHeaders(),
            },
            params: {
                update_all: update_all,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating event with ID ${id}:`, error);
        throw error;
    }
};

export const deleteCalendarEvent = async (id) => {
    try {
        const response = await api.delete(`/calendars/events/${id}`, {
            headers: {
                ...getAuthHeaders(),
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting event with ID ${id}:`, error);
        throw error;
    }
};  
