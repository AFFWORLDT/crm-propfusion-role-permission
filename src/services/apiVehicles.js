import Cookies from "universal-cookie";
import { buildUrl, checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();
export async function getVehicleLists(filters, fetchAll = false, signal) {
    const url = buildUrl("vehicles", filters, fetchAll);

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            signal,
        });

        if (!res.ok) throw new Error("Could not get vehicles!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
export async function getVehicle(vehicleId) {
    const url = `${getApiUrl()}/vehicles/${vehicleId}`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        if (!res.ok) throw new Error("Could not get vehicle!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}


export async function createVehicle(vehicleData, file) {
    const apiUrl = getApiUrl();
    const url = `${apiUrl}/vehicles`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(vehicleData),
        });

        if (!res.ok) throw new Error("Could not create vehicle!");

        const data = await res.json();
        if (file) {
            await updateVehicleProfile(data.id, file);
        }

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateVehicle(vehicleId, vehicleData, file) {
    const apiUrl = getApiUrl();
    const url = `${apiUrl}/vehicles/${vehicleId}`;

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(vehicleData),
        });

        if (!res.ok) throw new Error("Could not update vehicle!");

        const data = await res.json();
        if (file) {
            await updateVehicleProfile(vehicleId, file);
        }
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteVehicle(vehicleId) {
    const apiUrl = getApiUrl();
    const url = `${apiUrl}/vehicles/${vehicleId}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        if (!res.ok) throw new Error("Could not delete vehicle!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}


export async function updateVehicleProfile(id, file) {
    const url = `${getApiUrl()}/vehicles/${id}/upload_profile_pic`
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

export async function uploadVehiclePhotos(vehicleId, files) {
    const url = `${getApiUrl()}/vehicles/${vehicleId}/upload_photos`;
    try {
        const formData = new FormData();

        formData.append('photos', files);

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
        if (!res.ok) throw new Error('Failed to upload photos');

        const data = await res.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function deleteVehicleDocument(vehicleId, documentUrl) {
    const url = `${getApiUrl()}/vehicles/${vehicleId}/document?document_url=${documentUrl}`;
    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete vehicle document!");

        return true;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function uploadVehicleImage(vehicleId, file) {
    const url = `${getApiUrl()}/vehicles/${vehicleId}/upload_photo`;
    try {
        const formData = new FormData();
        formData.append('photo', file);

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: formData
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error('Failed to upload photo');

        const data = await res.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}