import Cookies from "universal-cookie";
import { buildUrl, checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();
export async function getWatchMenLists(filters, fetchAll = false, signal) {
    const url = buildUrl("watchmen", filters, fetchAll);

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            signal,
        });

        if (!res.ok) throw new Error("Could not get watchmen!");

        const data = await res.json();

        return data.watchmen;
    } catch (err) {
        throw new Error(err.message);
    }
}
export async function getWatchman(watchmanId) {
    const url = `${getApiUrl()}/watchmen/${watchmanId}`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${cookies.get("USER").access_token}`,
        },
    });
    if (!res.ok) throw new Error("Could not get watchman!");
    const data = await res.json();
    return data;
}


export async function createWatchman(watchmanData, file) {
    const apiUrl = getApiUrl();
    const url = `${apiUrl}/watchmen`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(watchmanData),
        });

        if (!res.ok) throw new Error("Could not create watchman!");

        const data = await res.json();
        if (file) {
            await updateWatchmanProfile(data.id, file);
        }

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateWatchman(watchmanId, watchmanData, file) {
    const apiUrl = getApiUrl();
    const url = `${apiUrl}/watchmen/${watchmanId}`;

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(watchmanData),
        });

        if (!res.ok) throw new Error("Could not update watchman!");

        const data = await res.json();
        if (file) {
            await updateWatchmanProfile(watchmanId, file);
        }
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteWatchman(watchmanId) {
    const apiUrl = getApiUrl();
    const url = `${apiUrl}/watchmen/${watchmanId}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        if (!res.ok) throw new Error("Could not delete watchman!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}


export async function updateWatchmanProfile(id, file) {
    const url = `${getApiUrl()}/watchman/${id}/upload_profile_pic`
    try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
            body: formData
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not update Watchman Profile!");
        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function uploadWatchmanDocs(watchmanId, files) {
    const url = `${getApiUrl()}/watchman/${watchmanId}/upload_docs`;
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

export async function deleteWatchmanDocument(watchmanId, documentUrl) {
    const url = `${getApiUrl()}/watchman/${watchmanId}/document?document_url=${documentUrl}`;
    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete watchman document!");

        return true;
    } catch (err) {
        throw new Error(err.message);
    }
}