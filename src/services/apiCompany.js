import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

export async function getCompanySettings() {
    const url = `${getApiUrl()}/admin/company`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        if (!res.ok) throw new Error("Could not get company settings!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getPublicCompanyData() {
    const url = `${getApiUrl()}/admin/public/company`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        if (!res.ok) throw new Error("Could not get public company data!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateCompanySettings(payload) {
    const url = `${getApiUrl()}/admin/company`;
  
    const formData = new FormData();

    for (const property in payload) {
        if (property === "company_logo_url" || property === "menu_logo_url") {
            formData.append(property.replace("_url", ""), payload[property][0]);
            continue;
        }
        formData.append(property, payload[property]);
    }

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
        if (!res.ok) throw new Error("Failed to update company settings!");
    } catch (err) {
        throw new Error(err.message);
    }  
}
