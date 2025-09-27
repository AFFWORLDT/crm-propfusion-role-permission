import Cookies from "universal-cookie";
import { buildUrl, checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

/**
 * Fetch owners with optional search filters
 * @param {Object} filters - Filters like owner_name, page, size
 * @param {AbortSignal} signal - AbortController signal for cancellation
 * @returns {Promise<Object>} - Owners data
 */
export async function fetchOwners(filters = {}, signal) {
    try {
        const defaultFilters = {
            page: 1,
            size: 10,
            ...filters
        };

        const url = buildUrl("owners", defaultFilters, false);

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
            throw new Error(errorData.message || "Could not fetch owners!");
        }

        const data = await res.json();
        console.log('Owners response:', data);
        
        return data;
    } catch (err) {
        if (err.name === 'AbortError') {
            throw err;
        }
        console.error('Error fetching owners:', err);
        throw new Error(err.message || "Failed to fetch owners");
    }
}

/**
 * Fetch tenants with optional search filters
 * @param {Object} filters - Filters like tenant_name, page, size
 * @param {AbortSignal} signal - AbortController signal for cancellation
 * @returns {Promise<Object>} - Tenants data
 */
export async function fetchTenants(filters = {}, signal) {
    try {
        const defaultFilters = {
            page: 1,
            size: 10,
            ...filters
        };

        const url = buildUrl("tenants", defaultFilters, false);

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
            throw new Error(errorData.message || "Could not fetch tenants!");
        }

        const data = await res.json();
        console.log('Tenants response:', data);
        
        return data;
    } catch (err) {
        if (err.name === 'AbortError') {
            throw err;
        }
        console.error('Error fetching tenants:', err);
        throw new Error(err.message || "Failed to fetch tenants");
    }
}

/**
 * Create or update an owner
 * @param {Object} ownerData - Owner data to create/update
 * @returns {Promise<Object>} - Created/updated owner
 */
export async function saveOwner(ownerData) {
    try {
        const url = `${getApiUrl()}/owners`;
        const method = ownerData.id ? "PUT" : "POST";
        
        console.log(`${ownerData.id ? 'Updating' : 'Creating'} owner:`, ownerData);

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
            body: JSON.stringify(ownerData),
        });

        checkUnauthorized(res.status, cookies);
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `Could not ${ownerData.id ? 'update' : 'create'} owner!`);
        }

        const data = await res.json();
        console.log('Owner save response:', data);
        
        return data;
    } catch (err) {
        console.error(`Error ${ownerData.id ? 'updating' : 'creating'} owner:`, err);
        throw new Error(err.message || `Failed to ${ownerData.id ? 'update' : 'create'} owner`);
    }
}

/**
 * Create or update a tenant
 * @param {Object} tenantData - Tenant data to create/update
 * @returns {Promise<Object>} - Created/updated tenant
 */
export async function saveTenant(tenantData) {
    try {
        const url = `${getApiUrl()}/tenants`;
        const method = tenantData.id ? "PUT" : "POST";
        
        console.log(`${tenantData.id ? 'Updating' : 'Creating'} tenant:`, tenantData);

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
            body: JSON.stringify(tenantData),
        });

        checkUnauthorized(res.status, cookies);
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `Could not ${tenantData.id ? 'update' : 'create'} tenant!`);
        }

        const data = await res.json();
        console.log('Tenant save response:', data);
        
        return data;
    } catch (err) {
        console.error(`Error ${tenantData.id ? 'updating' : 'creating'} tenant:`, err);
        throw new Error(err.message || `Failed to ${tenantData.id ? 'update' : 'create'} tenant`);
    }
}
