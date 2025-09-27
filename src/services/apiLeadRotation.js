import axiosInstance from "../utils/axiosInstance";
import Cookies from "universal-cookie";
import { buildUrl, checkUnauthorized } from "../utils/utils";


const cookies = new Cookies();

export async function getAgentRotationSettings() {
    const url = buildUrl("admin/agent-rotation");

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateAgentRotationSettings(data) {
    const response = await axiosInstance.post(
        `/admin/agent-rotation`,
        data
    );
    return response.data;
}


