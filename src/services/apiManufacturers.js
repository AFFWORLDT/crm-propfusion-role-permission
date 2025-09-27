import { buildUrl } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export async function getAllManufacturers(filters, fetchAll, signal) {
    const url = buildUrl("vehicle-manufacturers?", filters, fetchAll);

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            signal,
        });

        if (!res.ok) throw new Error("Could not get developers!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createManufacturer(manufacturerData, logoFile) {
    const url = `${getApiUrl()}/vehicle-manufacturers`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
            body: JSON.stringify(manufacturerData),
        });

        if (!res.ok) throw new Error("Could not create manufacturer!");

        const data = await res.json();
        if (logoFile) {
            await uploadManufacturerLogo(data.id, logoFile);
        }
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateManufacturer(manufacturerId, manufacturerData, logoFile) {
    const url = `${getApiUrl()}/vehicle-manufacturers/${manufacturerId}`;

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
            body: JSON.stringify(manufacturerData),
        });

        if (!res.ok) throw new Error("Could not update manufacturer!");

        const data = await res.json();
        if (logoFile) {
            await uploadManufacturerLogo(manufacturerId, logoFile);
        }
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteManufacturer(manufacturerId) {
    const url = `${getApiUrl()}/vehicle-manufacturers/${manufacturerId}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        if (!res.ok) throw new Error("Could not delete manufacturer!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function uploadManufacturerLogo(manufacturerId, logoFile) {
    const url = `${getApiUrl()}/vehicle-manufacturers/${manufacturerId}/upload_logo`;
    const formData = new FormData();
    formData.append("logo", logoFile);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
            body: formData,
        });

        if (!res.ok) throw new Error("Could not upload manufacturer logo!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
