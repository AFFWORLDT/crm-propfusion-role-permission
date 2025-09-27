import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

export async function getDashboardStats() {
    const user = cookies.get("USER");
    if (!user) {
        window.location.href = "/login";
        return;
    }

    const url = `${getApiUrl()}/properties/dashboard_stats`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get dashboard stats!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
