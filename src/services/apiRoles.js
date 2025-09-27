import Cookies from "universal-cookie";
import { buildUrl, checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

export async function getRolesPermissions() {
    const url = `${getApiUrl()}/roles/permissions`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get roles permissions!");

        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error fetching roles permissions:", err);
        throw new Error(err.message);
    }
}

export async function createRole(roleData) {
    const url = `${getApiUrl()}/roles`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
            body: JSON.stringify(roleData),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok && res.status === 400) throw new Error("Role already exists!");

        const data = await res.json();
        return data;
    } catch (err) {
        console.log(err);
        console.error("Error creating role:", err);
        throw new Error(err.message);
    }
}

export async function getRoles(filter) {
    const url = buildUrl("roles", filter);

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get roles!");

        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error fetching roles:", err);
        throw new Error(err.message);
    }
}

export async function getRole(roleId) {
    const url = `${getApiUrl()}/roles/${roleId}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get role!");

        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error fetching role:", err);
        throw new Error(err.message);
    }
}

export async function updateRole(roleId, roleData) {
    const url = `${getApiUrl()}/roles/${roleId}`;

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
            body: JSON.stringify(roleData),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not update role!");

        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error updating role:", err);
        throw new Error(err.message);
    }
}

export async function deleteRole(roleId) {
    const url = `${getApiUrl()}/roles/${roleId}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete role!");

        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error deleting role:", err);
        throw new Error(err.message);
    }
}

export async function assignRole(userId, roleId) {
    const url = `${getApiUrl()}/roles/assign`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
            body: JSON.stringify({
                user_id: userId,
                role_id: roleId
            }),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not assign role to user!");

        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Error assigning role to user:", err);
        throw new Error(err.message);
    }
}
