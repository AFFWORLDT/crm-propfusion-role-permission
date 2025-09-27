import { getApiUrl } from "../utils/getApiUrl";

/**
 * Register a new agent publicly
 * @param {Object} agentData - Agent registration data
 * @returns {Promise} API response
 */
export const registerAgent = async (agentData, id, roleid) => {
    try {
        const response = await fetch(
            `${getApiUrl()}/agent/public?affiliate_id=${id}&roleid=${roleid}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json",
                },
                body: JSON.stringify(agentData),
                // Note: No Authorization header for public registration
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Registration failed");
        }

        return await response.json();
    } catch (error) {
        console.error("Agent registration error:", error);
        throw error;
    }
};

/**
 * Check if email is already registered
 * @param {string} email - Email to check
 * @returns {Promise} API response
 */
export const checkEmailAvailability = async (email) => {
    try {
        const response = await fetch(
            `${getApiUrl()}/agent/check-email?email=${encodeURIComponent(email)}`,
            {
                method: "GET",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to check email availability");
        }

        return await response.json();
    } catch (error) {
        console.error("Email check error:", error);
        throw error;
    }
};

/**
 * Get available roles for agents
 * @returns {Promise} API response
 */
export const getAgentRoles = async () => {
    try {
        const response = await fetch(`${getApiUrl()}/agent/roles`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch agent roles");
        }

        return await response.json();
    } catch (error) {
        console.error("Get roles error:", error);
        throw error;
    }
};

/**
 * Get available teams for agents
 * @returns {Promise} API response
 */
export const getAgentTeams = async () => {
    try {
        const response = await fetch(`${getApiUrl()}/agent/teams`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch agent teams");
        }

        return await response.json();
    } catch (error) {
        console.error("Get teams error:", error);
        throw error;
    }
};

/**
 * Upload agent documents
 * @param {File[]} files - Files to upload
 * @param {string} agentId - Agent ID (if available)
 * @returns {Promise} API response
 */
export const uploadAgentDocuments = async (files, agentId = null) => {
    try {
        const formData = new FormData();

        files.forEach((file) => {
            formData.append("documents", file);
        });

        if (agentId) {
            formData.append("agent_id", agentId);
        }

        const response = await fetch(`${getApiUrl()}/agent/upload-documents`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to upload documents");
        }

        return await response.json();
    } catch (error) {
        console.error("Document upload error:", error);
        throw error;
    }
};

/**
 * Get registration status
 * @param {string} email - Email to check status
 * @returns {Promise} API response
 */
export const getRegistrationStatus = async (email) => {
    try {
        const response = await fetch(
            `${getApiUrl()}/agent/registration-status?email=${encodeURIComponent(email)}`,
            {
                method: "GET",
            }
        );

        if (!response.ok) {
            throw new Error("Failed to get registration status");
        }

        return await response.json();
    } catch (error) {
        console.error("Status check error:", error);
        throw error;
    }
};
