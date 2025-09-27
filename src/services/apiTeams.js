import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

export async function getTeams() {
    const url = `${getApiUrl()}/api/teams/`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        if (!res.ok) throw new Error("Could not get teams!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getTeamById(id) {
    const url = `${getApiUrl()}/api/teams/${id}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        if (!res.ok) throw new Error("Could not get team data!");

        const data = await res.json();
        
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getRoles() {
    const url = `${getApiUrl()}/roles?size=1000`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        if (!res.ok) throw new Error("Could not get roles!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createTeam(payload) {
    const url = `${getApiUrl()}/api/teams/`;

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
        if (!res.ok) throw new Error("Could not create team!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateTeam(id, payload) {
    const url = `${getApiUrl()}/api/teams/${id}`;

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
        if (!res.ok) throw new Error("Could not update team!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteTeam(id) {
    const url = `${getApiUrl()}/api/teams/${id}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete member!");
    } catch (err) {
        throw new Error(err.message);
    }
}
