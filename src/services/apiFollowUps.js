import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";
import { buildUrl } from "../utils/utils";

const cookies = new Cookies();

export async function getFollowUps(type, targetId) {
    const url = `${getApiUrl()}/followups?type=${type}&target_id=${targetId}&page=1&limit=100`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        if (!res.ok) throw new Error("Could not get follow ups!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createFollowUp(payload) {
    const url = `${getApiUrl()}/followup`;

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
        if (!res.ok) throw new Error("Could not create follow up!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getFollowUpsByStage(stageId) {
    const url = `${getApiUrl()}/followups?type=lead&stage=${stageId}&page=1&limit=100`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });
        if (!res.ok) throw new Error("Could not get follow ups by stage!");
        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getAllLeadFollowUps(clientType = "SELL") {
    const url = `${getApiUrl()}/properties/get_leads?clientType=${clientType}&dateSortType=DESC&page=1&size=100&batch_pages=1`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("token")}`,
            },
        });

        if (!res.ok) throw new Error("Could not get follow ups!");

        const data = await res.json();
        return data.leads || [];
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getFollowUpReport(id) {
  
    try {
        const url = `${getApiUrl()}/properties/followup/report/lead-metrics?${id ? `agent_id=${id}` : ""}`;
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get follow up report!");
        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
