import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

export async function getAudience(page, size, audienceType = null) {
    let url = `${getApiUrl()}/api/email_manager/audience_email?page=${page}&size=${size}`;

    if (audienceType) {
        url += `&audience_type=${audienceType}`;
    }
    
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


export async function CreateAudience(payload) {
    const url = `${getApiUrl()}/api/email_manager/public/audience_email`;

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

   
        // const data = await res.json();
          
        if (!res.ok)
            throw new Error("");

    } catch (err) {
        throw new Error(err.message);
    }
}

export async function CreateAudienceprivate(payload) {
    const url = `${getApiUrl()}/api/email_manager/public/audience_email`;

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

export async function getAudienceId(Id) {
    const url = `${getApiUrl()}/api/email_manager/audience_email/${Id}`;

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


export async function updateAudience(id, payload) {
    const url = `${getApiUrl()}/api/email_manager/audience_email/${id}`;

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


export async function deleteAudience(id) {
    const url = `${getApiUrl()}/api/email_manager/audience_email/${id}`;

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



