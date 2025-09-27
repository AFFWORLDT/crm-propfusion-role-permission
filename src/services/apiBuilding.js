import Cookies from "universal-cookie";
import { getApiUrl } from "../utils/getApiUrl";
import { buildUrl, checkUnauthorized } from "../utils/utils";

const cookies = new Cookies();
export async function createBuilding(newBuilding, photos, document_type) {
    const url = `${getApiUrl()}/buildings/create`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(newBuilding),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not create newBuilding!");

        const { id } = await res.json();

        // Now, uploading images
        if (photos?.length) {
            await uploadBuildingtImages(id, photos, document_type);
        }
    } catch (err) {
        throw new Error(err.message);
    }
}

async function uploadBuildingtImages(buildindid, photos, document_type) {
    const url = `${getApiUrl()}/buildings/${buildindid}/upload_document?${document_type}`;

    const formData = new FormData();

    Array.from(photos).forEach((file) => {
        formData.append("photos", file);
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
        if (!res.ok) throw new Error("Failed to upload photos!");
    } catch (err) {
        throw new Error(err.message);
    }
}
export async function getBuilding(filters, signal) {
    const url = buildUrl("buildings", filters);

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            signal,
        });

        if (!res.ok) throw new Error("Could not get buildings!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getBuildNameList(signal) {
    const url = `${getApiUrl()}/buildings/list?page=1&size=1000`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            signal,
        });

        if (!res.ok) throw new Error("Could not get buildings!");

        const data = await res.json();

        return data.buildings;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getBuildingList(filters, fetchAll = false, signal) {
    const url = buildUrl("buildings", filters, fetchAll);

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            signal,
        });

        if (!res.ok) throw new Error("Could not get buildings!");

        const data = await res.json();

        return data.buildings;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteBuilding(buildingId) {
    const url = `${getApiUrl()}/buildings/${buildingId}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete building!");

        return true;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateBuilding(buildingId, updatedBuilding, photos) {
    const url = `${getApiUrl()}/buildings/${buildingId}`;

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(updatedBuilding),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not update building!");

        // Now, uploading images if any
        if (photos?.length) {
            await uploadBuildingtImages(buildingId, photos, "photos");
        }

        return true;
    } catch (err) {
        throw new Error(err.message);
    }
}
