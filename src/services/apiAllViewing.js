import Cookies from "universal-cookie";
import { buildUrl, checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";


const cookies = new Cookies();

export async function getViewingLists(filters, fetchAll = false, signal) {
    const url = buildUrl("viewings", filters, fetchAll);

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            signal,
        });

        checkUnauthorized(res.status, cookies);

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getViewing(viewingId) {
    const url = `${getApiUrl()}/viewings/${viewingId}`;

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

export async function createViewing(viewingData) {
    const url = `${getApiUrl()}/viewings`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(viewingData),
        });

        checkUnauthorized(res.status, cookies);
    
        if(res.status === 422){
            const data = await res.json();
            throw new Error(data.detail || "Validation error occurred");
        }
        if(res.ok === false){
            const data = await res.json();
            throw new Error(data.detail || data.message || "An error occurred");
        }
        const data = await res.json();

        return data;
    } catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}

export async function updateViewing(viewingId, viewingData) {
    const url = `${getApiUrl()}/viewings/${viewingId}`;

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(viewingData),
        });

        checkUnauthorized(res.status, cookies);

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteViewing(viewingId) {
    const url = `${getApiUrl()}/viewings/${viewingId}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);

        if (res.status === 403) {
            const data = await res.json();
            throw new Error(data.detail || "Insufficient permissions to delete viewing");
        }

        // Some APIs return a body, some don't. Adjust as needed.
        if (res.status === 204) {
            return { success: true };
        }
        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
