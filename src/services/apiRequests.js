import Cookies from "universal-cookie";
import { buildUrl, checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

export async function getAllPortalRequests(filter) {
    const url = buildUrl("properties/portal_enable_requests", filter);
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get portal requests!");
        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updatePortalRequest(id, action) {
    const url = `${getApiUrl()}/properties/portal_enable_requests/${id}/status?action=${action}`;

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not update portal request!");
        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
