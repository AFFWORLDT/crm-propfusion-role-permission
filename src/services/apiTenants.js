import Cookies from "universal-cookie";
import { buildUrl, checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

const cookies = new Cookies();

export async function bulkAssignedOwner(payload) {
    const url = `${getApiUrl()}/bulk-assign`;
    const res = await axiosInstance.put(url, {
        owner_ids: payload.owner_ids,
        new_agent_id: payload.new_agent_id,
    });
    return res.data;
}

export async function getAllTenants(filters, fetchAll = false) {
    const url = buildUrl("tenants", filters, fetchAll);
    try {
        const res = await fetch(url, {
            method: "GET",

            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get Tenants!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createTenents(payload, file) {
    const url = `${getApiUrl()}/tenants`;
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify({ ...payload }),
        });

        checkUnauthorized(res.status, cookies);
        const data = await res.json();

        if (!res.ok) throw new Error("Failed to create tenant");
        if (file) {
            await updateTenantProfile(data.id, file);
        }
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateTenant(tenantId, tenantData) {
    try {
        const url = `${getApiUrl()}/tenants/${tenantId}`;
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(tenantData),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) {
            throw new Error("Failed to update tenant");
        }

        const data = await res.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function getTenant(id) {
    try {
        const url = `${getApiUrl()}/tenants/${id}`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) {
            throw new Error("Failed to fetch tenant");
        }

        const data = await res.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function deleteTenant(id) {
    const url = `${getApiUrl()}/tenants/${id}`;
    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete tenant!");

        return true;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function sendTenantsCredential(id) {
    const url = `${getApiUrl()}/tenant/${id}/send_credentials`;
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not send tenant credentials!");
        return true;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getTenants(filters) {
    const url = buildUrl("tenants", {
        ...filters,
        size: filters.size || 10, // Ensure size is always set
        page: filters.page || 1,   // Ensure page is always set
    });

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch tenants");

    const data = await res.json();
    return {
        ...data,
        tenants: data.tenants || [], // Ensure tenants is always an array
    };
}

export async function uploadTenantDocs(tenantId, files) {
    const url = `${getApiUrl()}/tenant/${tenantId}/upload_docs`;
    try {
        const formData = new FormData();

        // Append multiple files to formData
        files.forEach(file => {
            formData.append('docs', file);
        });

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
                // Note: Don't set Content-Type header when using FormData,
                // browser will set it automatically with correct boundary
            },
            body: formData
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error('Failed to upload documents');

        const data = await res.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function deleteTenantDocument(tenantId, documentUrl) {
    const url = `${getApiUrl()}/tenant/${tenantId}/document?document_url=${documentUrl}`;
    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete tenant document!");

        return true;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getSimplifiedTenantLists(filters, fetchAll = false) {
    const url = buildUrl(`tenants-list`, filters, fetchAll);
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get simplified tenant lists!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateTenantProfile(id, file) {
    const url = `${getApiUrl()}/tenant/${id}/upload_profile_pic`
    try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
          
            },
            body: formData
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Failed to update tenant profile");
        if (res.ok) {
            toast.success("Tenant profile updated successfully");
            window.location.reload();
        }
        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}   