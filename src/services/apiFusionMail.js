import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

export async function getFusionMail(page, size) {
    const url = `${getApiUrl()}/api/email_manager/campaign?page=${page}&size=${size}`;
    
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get Audience!");
        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}


export async function CreateFusionMail(payload) {
    const url = `${getApiUrl()}/api/email_manager/campaign`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify({...payload}),
        });

        checkUnauthorized(res.status, cookies);
        // const data = await res.json();
          
        if (!res.ok)
            throw new Error("");

    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getFusionMailId(Id) {
    const url = `${getApiUrl()}/api/email_manager/campaign/${Id}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get Data!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}


export async function updateFusionMail(id, payload) {
    const url = `${getApiUrl()}/api/email_manager/campaign/${id}`;

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
        if (!res.ok) throw new Error("Could not update!");

    } catch (err) {
        throw new Error(err.message);
    }
}


export async function deleteFusionMail(id) {
    const url = `${getApiUrl()}/api/email_manager/campaign/${id}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete Audience!");
    } catch (err) {
        throw new Error(err.message);
    }
}



