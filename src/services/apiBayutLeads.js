import Cookies from "universal-cookie";
import { buildUrl, checkUnauthorized } from "../utils/utils";

const cookies = new Cookies();

export async function getBayutLeads(filter) {
    const url = buildUrl("integration/bayut_leads", filter);
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get bayut leads!");
        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
