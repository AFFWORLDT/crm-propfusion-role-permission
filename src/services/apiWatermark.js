import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

export async function getWatermarkSettings() {
    const url = `${getApiUrl()}/admin/watermark`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        if (!res.ok) throw new Error("Could not get watermark settings!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateWatermarkSettings(payload) {
    const url = `${getApiUrl()}/admin/watermark`;

    const formData = new FormData();

    for (const property in payload) {
        if (property === "watermark_url") {
            formData.append("watermark_file", payload[property][0]);
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
        if (!res.ok) throw new Error("Failed to update watermark settings!");
    } catch (err) {
        throw new Error(err.message);
    }
}
