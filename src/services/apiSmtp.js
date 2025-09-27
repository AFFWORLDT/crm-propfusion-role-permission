import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";


const cookies = new Cookies();
export async function getSmtp() {
    const url = `${getApiUrl()}/api/email_manager/smtp_config`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get smtp!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
   
}

export async function CreateSmtp(payload) {
    const url = `${getApiUrl()}/api/email_manager/smtp_config`;

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

export async function getSmtpId(Id) {
    const url = `${getApiUrl()}/api/email_manager/smtp_config/${Id}`;

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


export async function updateSmtp(id, payload) {
    const url = `${getApiUrl()}/api/email_manager/smtp_config/${id}`;

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


export async function deleteSmtp(id) {
    const url = `${getApiUrl()}/api/email_manager/smtp_config/${id}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete Smtp!");
    } catch (err) {
        throw new Error(err.message);
    }
}

