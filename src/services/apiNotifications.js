import Cookies from "universal-cookie";
import { buildUrl, checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

export async function getNotifications(filters, signal) {
    const url = buildUrl("notifications/", filters, false);

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            signal,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get notifications!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateNotification(id, payload) {
    const url = `${getApiUrl()}/notifications/${id}`;

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
        if (!res.ok) throw new Error("Could not update notification!");
    } catch (err) {
        throw new Error(err.message);
    }
}

async function deleteNotification(id) {
    const url = `${getApiUrl()}/notifications/${id}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete notification!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteMultipleNotifications(idArr) {
    try {
        if (idArr?.length) {
            await Promise.all(idArr.map((id) => deleteNotification(id)));
        }
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getUnseenNotificationCount() {
    const url = `${getApiUrl()}/notifications/notifications/unseen-count`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get notification count!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
