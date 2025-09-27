import Cookies from "universal-cookie";
import { buildUrl, checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

export async function getWhatsappLogs(filters, signal) {
    try {
        const url = buildUrl("integration/whatsapp_message_logs", filters, false);
        console.log('Fetching WhatsApp logs from:', url);

        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
            signal,
        });

        checkUnauthorized(res.status, cookies);
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Could not get WhatsApp logs!");
        }

        const data = await res.json();
        console.log('Raw API response:', data);

        // Transform response to match new structure if needed
        const transformedData = {
            count: data.count || 0,
            page: filters.page || 1,
            per_page: filters.size || 100,
            logs: (data.logs || data.messages || []).map(message => ({
                ...message,
                _id: message.id || message._id,
                agent: message.agent || null
            }))
        };
        
        console.log('Transformed WhatsApp logs:', transformedData);
        return transformedData;
    } catch (err) {
        if (err.name === 'AbortError') {
            throw err;
        }
        console.error('Error fetching WhatsApp logs:', err);
        throw new Error(err.message || "Failed to fetch WhatsApp logs");
    }
} 

export async function getWhatsappConversations(filters, signal) {
    try {
        const url = buildUrl("integration/whatsapp_message_logs", filters, false);
        console.log('Fetching WhatsApp logs from:', url);

        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
            signal,
        });

        checkUnauthorized(res.status, cookies);
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Could not get WhatsApp logs!");
        }

        const data = await res.json();
        console.log('Raw API response:', data);

        // Transform response to match new structure if needed
        const transformedData = {
            count: data.count || 0,
            page: filters.page || 1,
            per_page: filters.size || 100,
            logs: (data.logs || data.messages || []).map(message => ({
                ...message,
                _id: message.id || message._id,
                agent: message.agent || null
            }))
        };
        
        console.log('Transformed WhatsApp logs:', transformedData);
        return transformedData;
    } catch (err) {
        if (err.name === 'AbortError') {
            throw err;
        }
        console.error('Error fetching WhatsApp logs:', err);
        throw new Error(err.message || "Failed to fetch WhatsApp logs");
    }
} 

// New API functions for WhatsApp Web-like interface

/**
 * Fetch WhatsApp conversation list
 * @param {Object} filters - Filters like page, size, sort_by
 * @param {AbortSignal} signal - AbortController signal for cancellation
 * @returns {Promise<Object>} - WhatsApp conversations data
 */
export async function fetchWhatsappConversations(filters = {}, signal) {
    try {
        const defaultFilters = {
            page: 1,
            size: 10,
            sort_by: 'recent',
            ...filters
        };

        const baseUrl = `${getApiUrl()}/webhook/whatsapp/conversations`;
        let url = `${baseUrl}?page=${defaultFilters.page}&size=${defaultFilters.size}`;
        
        if (defaultFilters.sort_by) {
            url += `&sort_by=${defaultFilters.sort_by}`;
        }

        console.log('Fetching WhatsApp conversations from:', url);

        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
            signal,
        });

        checkUnauthorized(res.status, cookies);
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Could not fetch WhatsApp conversations!");
        }

        const data = await res.json();
        console.log('WhatsApp conversations response:', data);
        
        return data;
    } catch (err) {
        if (err.name === 'AbortError') {
            throw err;
        }
        console.error('Error fetching WhatsApp conversations:', err);
        throw new Error(err.message || "Failed to fetch WhatsApp conversations");
    }
}

/**
 * Fetch messages for a specific WhatsApp conversation
 * @param {string} phoneNumber - The phone number identifier for the conversation
 * @param {Object} options - Options like limit
 * @param {AbortSignal} signal - AbortController signal for cancellation
 * @returns {Promise<Object>} - The conversation messages
 */
export async function fetchWhatsappConversationMessages(phoneNumber, options = {}, signal) {
    try {
        if (!phoneNumber) {
            throw new Error("Phone number is required to fetch conversation messages");
        }

        const limit = options.limit || 50;
        const baseUrl = `${getApiUrl()}/webhook/whatsapp/conversation/${phoneNumber}`;
        const url = `${baseUrl}?limit=${limit}`;

        console.log('Fetching WhatsApp conversation messages from:', url);

        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
            signal,
        });

        checkUnauthorized(res.status, cookies);
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Could not fetch WhatsApp conversation messages!");
        }

        const data = await res.json();
        console.log('WhatsApp conversation messages response:', data);
        
        return data;
    } catch (err) {
        if (err.name === 'AbortError') {
            throw err;
        }
        console.error('Error fetching WhatsApp conversation messages:', err);
        throw new Error(err.message || "Failed to fetch WhatsApp conversation messages");
    }
}

/**
 * Send a WhatsApp message to a specific contact
 * @param {string} phoneNumber - The recipient's phone number
 * @param {string} message - The message content
 * @param {string} type - The message type (default: 'text')
 * @returns {Promise<Object>} - The sent message response
 */
export async function sendWhatsappMessage(phoneNumber, message, type = 'text') {
    try {
        if (!phoneNumber) {
            throw new Error("Phone number is required to send a message");
        }

        if (!message) {
            throw new Error("Message content is required");
        }

        // Ensure phone number has + prefix
        const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
        
        const url = `${getApiUrl()}/webhook/whatsapp/send/text`;
        
        console.log('Sending WhatsApp message to:', formattedPhoneNumber);

        // Create form data for x-www-form-urlencoded
        const formData = new URLSearchParams();
        formData.append('phone_number', formattedPhoneNumber);
        formData.append('message', message);
        formData.append('preview_url', 'true');

        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${cookies.get("USER")?.access_token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAzOCwicm9sZSI6ImFkbWluIiwidHlwZSI6ImFnZW50IiwiZXhwIjoxNzQ0MjA1OTIxfQ.PJ01EBBbtxqJWrcpZMSqu5DYVK9fFPm6cliWFvoWZRo'}`,
            },
            body: formData
        });
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Could not send WhatsApp message!");
        }

        const data = await res.json();
        console.log('WhatsApp send message response:', data);
        
        return data;
    } catch (err) {
        console.error('Error sending WhatsApp message:', err);
        throw new Error(err.message || "Failed to send WhatsApp message");
    }
} 