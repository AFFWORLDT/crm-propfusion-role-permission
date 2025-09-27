import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

export async function getFeatures() {
    const url = `${getApiUrl()}/admin/features`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get features!");

        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error fetching features:", err);
        throw new Error(err.message);
    }
}

export async function getGetMePermission() {
    const url = `${getApiUrl()}/me/permissions`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get me permission!");

        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error fetching permission:", err);
        throw new Error(err.message);
    }
}

// Removed localStorage caching - now using React Query for fresh data
