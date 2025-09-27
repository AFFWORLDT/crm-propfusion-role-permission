import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";
const cookies = new Cookies();

export async function getStatus(statusType) {
    const url = `${getApiUrl()}/status?status_type=${statusType}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get statues!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function createStatus(payload) {
    const url = `${getApiUrl()}/status`;
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(payload),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not create status!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createMultipleStatus(statusesArr) {
    try {
        if (statusesArr?.length) {
            await Promise.all(
                statusesArr.map((statusObj) => createStatus(statusObj))
            );
        }
    } catch (err) {
        throw new Error(err.message);
    }
}

async function updateStatus(id, payload) {
    const url = `${getApiUrl()}/status/${id}`;

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
        if (!res.ok) throw new Error("Could not update status!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateMultipleStatuses(statusesArr) {
    try {
        if (statusesArr?.length) {
            await Promise.all(
                statusesArr.map((statusObj) =>
                    updateStatus(statusObj.id, statusObj)
                )
            );
        }
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteStatus(id) {
    const url = `${getApiUrl()}/status/${id}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete status!");
    } catch (err) {
        throw new Error(err.message);
    }
}
