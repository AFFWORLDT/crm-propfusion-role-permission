import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

export async function getAllMetaAds() {
    const url = `${getApiUrl()}/meta-ad-forms`;
    try {
        const res = await fetch(url, {
            method: "GET",

            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get Rental Agreement!");

        const data = await res.json();
        return data?.meta_ad_forms;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getMetaAdFormById(formId) {
    const url = `${getApiUrl()}/metaforms/${formId}`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get Meta Ad Form!");

        const data = await res.json();
        return data?.metaforms;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createMetaAdForm(formData) {
    const url = `${getApiUrl()}/meta-ad-forms`;
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
            body: JSON.stringify(formData),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not create Meta Ad Form!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateMetaAdForm(formId, formData) {
    const url = `${getApiUrl()}/meta-ad-forms/${formId}`;
    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
            body: JSON.stringify(formData),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not update Meta Ad Form!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteMetaAdForm(formId) {
    const url = `${getApiUrl()}/meta-ad-forms/${formId}`;
    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "*/*",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete Meta Ad Form!");

        return true;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getConnectedPages() {
    const url = `${getApiUrl()}/connected-pages`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get connected pages!");

        const data = await res.json();
        return data?.pages;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getPageFormsById(pageId) {
    const url = `${getApiUrl()}/page-forms-by-id?page_id=${pageId}`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get page forms!");

        const data = await res.json();
        return data?.data;
    } catch (err) {
        throw new Error(err.message);
    }
}
