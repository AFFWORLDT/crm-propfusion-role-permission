import { getApiUrl } from "../utils/getApiUrl";
import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";

const API_BASE_URL = getApiUrl();
const cookies = new Cookies();

// Helper function to get auth headers
const getAuthHeaders = () => {
  let user = cookies.get("USER");
  if (!user) {
    const localUser = localStorage.getItem("CRMUSER");
    if (localUser) {
      user = JSON.parse(localUser);
    }
  }
  
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(user?.access_token && { Authorization: `Bearer ${user.access_token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  checkUnauthorized(response.status, cookies);
  
  if (!response.ok) {
    const isJson = (response.headers.get("content-type") || "").includes("application/json");
    let message = "Request failed";
    
    if (isJson) {
      const errorData = await response.json().catch(() => ({}));
      message = errorData?.message || errorData?.error || message;
    } else {
      message = await response.text().catch(() => message);
    }
    
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  
  const isJson = (response.headers.get("content-type") || "").includes("application/json");
  return isJson ? response.json() : response.text();
};

// Create a new query
export const createQuery = async (queryData) => {
  try {
    // Check if queryData is FormData or regular object
    const isFormData = queryData instanceof FormData;
    
    const headers = isFormData 
      ? {
          Accept: "application/json",
          Authorization: getAuthHeaders().Authorization,
        }
      : getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/queries`, {
      method: "POST",
      headers,
      body: isFormData ? queryData : JSON.stringify(queryData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error creating query:", error);
    throw error;
  }
};

// Get organization queries with optional filters
export const getOrganizationQueries = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add common query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const url = `${API_BASE_URL}/queries${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching organization queries:", error);
    throw error;
  }
};

// Get query categories
export const getQueryCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/queries/categories/list`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching query categories:", error);
    throw error;
  }
};

// Get query priorities
export const getQueryPriorities = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/queries/priorities/list`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching query priorities:", error);
    throw error;
  }
};

// Get a specific query by ID
export const getQueryById = async (queryId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/queries/${queryId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching query by ID:", error);
    throw error;
  }
};

// Update a query
export const updateQuery = async (queryId, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/queries/${queryId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error updating query:", error);
    throw error;
  }
};

// Delete a query
export const deleteQuery = async (queryId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/queries/${queryId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error deleting query:", error);
    throw error;
  }
};

// Upload attachment for a query
export const uploadQueryAttachment = async (queryId, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    let user = cookies.get("USER");
    if (!user) {
      const localUser = localStorage.getItem("CRMUSER");
      if (localUser) {
        user = JSON.parse(localUser);
      }
    }

    const headers = {
      ...(user?.access_token && { Authorization: `Bearer ${user.access_token}` }),
    };

    const response = await fetch(`${API_BASE_URL}/queries/${queryId}/attachments`, {
      method: "POST",
      headers,
      body: formData,
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Error uploading attachment:", error);
    throw error;
  }
};

// Get query statistics for dashboard
export const getQueryStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/queries/statuses/list`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching query stats:", error);
    throw error;
  }
};

// Admin functions for query resolution

// Resolve a query (admin endpoint)
export const resolveQuery = async (queryId, resolutionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/queries/${queryId}/resolve`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(resolutionData),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error resolving query:", error);
    throw error;
  }
};

// Get all queries for admin (admin endpoint)
export const getAllQueriesForAdmin = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add common query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const url = `${API_BASE_URL}/admin/queries${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching all queries for admin:", error);
    throw error;
  }
};

// Get all queries from all organizations (admin endpoint)
export const getAllQueriesFromAllOrganizations = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    // Add common query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const url = `${API_BASE_URL}/queries/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching all queries from all organizations:", error);
    throw error;
  }
};
