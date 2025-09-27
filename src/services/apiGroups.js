import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";
const cookies = new Cookies();

export async function getGroups(groupType) {
    const url = `${getApiUrl()}/groups?group_type=${groupType}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get groups!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function createGroup(payload) {
    const url = `${getApiUrl()}/groups`;
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
        if (!res.ok) throw new Error("Could not create group!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createMultipleGroups(groupsArr) {
    try {
        if (groupsArr?.length) {
            await Promise.all(groupsArr.map((groupObj) => createGroup(groupObj)));
        }
    } catch (err) {
        throw new Error(err.message);
    }
}

async function updateGroup(id, payload) {
    const url = `${getApiUrl()}/groups/${id}`;

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
        if (!res.ok) throw new Error("Could not update group!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateMultipleGroups(groupsArr) {
    try {
        if (groupsArr?.length) {
            await Promise.all(
                groupsArr.map((groupObj) => updateGroup(groupObj.id, groupObj))
            );
        }
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteGroup(id) {
    const url = `${getApiUrl()}/groups/${id}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete group!");
    } catch (err) {
        throw new Error(err.message);
    }
}