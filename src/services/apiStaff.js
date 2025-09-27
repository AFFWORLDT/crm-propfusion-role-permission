import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

export async function getStaff(agentId) {
    const url = `${getApiUrl()}/agent/${agentId || "all"}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get staff!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function uploadStaffDocs(agentId, docs) {
    const url = `${getApiUrl()}/agent/${agentId}/upload_docs`;

    const formData = new FormData();

    Array.from(docs).forEach((file) => {
        formData.append("docs", file);
    });

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: formData,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Failed to upload documents!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createStaff(payload) {
    const url = `${getApiUrl()}/agent/`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify({ ...payload, avatar: "" }),
        });

        checkUnauthorized(res.status, cookies);
        const data = await res.json();

        if (!res.ok)
            throw new Error(
                data.detail === "Email already registered"
                    ? data.detail + "!"
                    : "Could not create member!"
            );

        // Now, uploading avatar
        await uploadStaffAvatar(data.id, payload.avatar);
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateStaff(id, payload) {
    const url = `${getApiUrl()}/agent/${id}`;
    const isNewImage = typeof payload.avatar === "object";

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(payload),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not update member!");

        // Now, uploading avatar
        if (isNewImage) await uploadStaffAvatar(payload.id, payload.avatar);
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function uploadStaffAvatar(agentId, imageFile) {
    const url = `${getApiUrl()}/agent/${agentId}/upload_avatar`;

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: formData,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Failed to update avatar!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateStaffPass(id, payload) {
    const url = `${getApiUrl()}/agent/${id}/update_password`;

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(payload),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not update password!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteStaff(id) {
    const url = `${getApiUrl()}/agent/${id}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete member!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteStaffDocs(agentId, docUrls) {
    const url = `${getApiUrl()}/agent/${agentId}/delete_docs`;

    // Convert docUrls array to query string
    const queryParams = docUrls
        .map((url) => `doc_urls=${encodeURIComponent(url)}`)
        .join("&");
    const fullUrl = `${url}?${queryParams}`;

    try {
        const res = await fetch(fullUrl, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete documents!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function uploadStaffQRCode(agentId, qrCodeFile) {
    const url = `${getApiUrl()}/agent/${agentId}/upload_qr_code`;

    const formData = new FormData();
    formData.append("file", qrCodeFile);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: formData,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Failed to upload QR code!");
    } catch (err) {
        throw new Error(err.message);
    }
}
