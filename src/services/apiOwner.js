import Cookies from "universal-cookie";
import { buildUrl, checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();
const API_URL = getApiUrl();

const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
});

export async function getAllOwner(filters, fetchAll = false) {
    const url = buildUrl("owners", filters, fetchAll);
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get Owner!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createOwner(ownerData, file) {
    try {
        const res = await fetch(`${API_URL}/owners`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(ownerData),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || "Failed to create owner");
        }
        const data = await res.json();
        if (file) {
            await updateOwnerProfile(data.id, file);
        }
        return data;
    } catch (error) {
        throw new Error(error.message || "Failed to create owner");
    }
}

export async function updateOwner(id, ownerData, file) {
    try {
        const dataToSend = {};

        if (ownerData.owner_type) dataToSend.owner_type = ownerData.owner_type;
        if (ownerData.owner_name) dataToSend.owner_name = ownerData.owner_name;
        if (ownerData.owner_info) dataToSend.owner_info = ownerData.owner_info;
        if (ownerData.lessor_name)
            dataToSend.lessor_name = ownerData.lessor_name;
        if (ownerData.lessor_emirates_id)
            dataToSend.lessor_emirates_id = ownerData.lessor_emirates_id;
        if (ownerData.license_no) dataToSend.license_no = ownerData.license_no;
        if (ownerData.lessor_email)
            dataToSend.lessor_email = ownerData.lessor_email;
        if (ownerData.lessor_phone)
            dataToSend.lessor_phone = ownerData.lessor_phone;
        if (ownerData.nationality)
            dataToSend.nationality = ownerData.nationality;
        if (ownerData.secondryPhone)
            dataToSend.secondryPhone = ownerData.secondryPhone;
        if (ownerData.kyc_verification !== undefined)
            dataToSend.kyc_verification = ownerData.kyc_verification || false;
        if (ownerData.transaction_type)
            dataToSend.transaction_type = ownerData.transaction_type;
        if (ownerData.dob) dataToSend.dob = ownerData.dob;

        const res = await fetch(`${API_URL}/owners/${id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(dataToSend),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || "Failed to update owner");
        }
        if (file) {
            await updateOwnerProfile(id, file);
        }
        return await res.json();
    } catch (error) {
        throw new Error(error.message || "Failed to update owner");
    }
}

export async function getOwner(id) {
    try {
        const res = await fetch(`${API_URL}/owners/${id}`, {
            headers: getHeaders(),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || "Failed to fetch owner");
        }
        return await res.json();
    } catch (error) {
        throw new Error(error.message || "Failed to fetch owner details");
    }
}

export async function deleteOwner(id) {
    const url = `${API_URL}/owners/${id}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete Owner!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getOwners(searchQuery = "") {
    const url = `${API_URL}/owners${searchQuery ? `?owner_name=${encodeURIComponent(searchQuery)}` : ""}`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get Owners!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getOwnerList() {
    const url = `${API_URL}/owners?size=1000`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get Owners!");

        const data = await res.json();
        return data?.owners;
    } catch (err) {
        throw new Error(err.message);
    }
}
export async function updateOwnerProfile(id, file) {
    const url = `${API_URL}/owner/${id}/upload_profile_pic`;
    try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
            body: formData,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not update Owner Profile!");
        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function uploadOwnerDocs(ownerId, files) {
    const url = `${getApiUrl()}/owner/${ownerId}/upload_docs`;
    try {
        const formData = new FormData();

        // Append multiple files to formData
        files.forEach((file) => {
            formData.append("docs", file);
        });

        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
                // Note: Don't set Content-Type header when using FormData,
                // browser will set it automatically with correct boundary
            },
            body: formData,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Failed to upload documents");

        const data = await res.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function deleteOwnerDocument(ownerId, documentUrl) {
    const url = `${getApiUrl()}/owner/${ownerId}/document?document_url=${documentUrl}`;
    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete owner document!");

        return true;
    } catch (err) {
        throw new Error(err.message);
    }
}
