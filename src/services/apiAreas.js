import { getApiUrl } from "../utils/getApiUrl";
import { buildUrl, checkUnauthorized } from "../utils/utils";
import Cookies from "universal-cookie";

const cookies = new Cookies();
export async function createArea(data) {
    const url = `${getApiUrl()}/properties/add_area_with_image`;
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("image", data.logo);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: formData,
        });

        checkUnauthorized(res.status, cookies);

        return res;
    } catch (err) {
        throw new Error(err.message);
    }
}
export async function getAreas(filters, fetchAll = false, signal) {
    const url = `${buildUrl("locations/communities", filters, fetchAll)}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            signal,
        });

        if (!res.ok) throw new Error("Could not get areas!");

        const data = await res.json();

        return {
            areas: (data.communities || []).map((item) => ({
                id: item.name,
                name: item.name,
                agent_name:
                    item.assigned_agents && item.assigned_agents.length > 0
                        ? item.assigned_agents[0].name
                        : "N/A",
                imgUrl:
                    item.photos && item.photos.length > 0 ? item.photos[0] : "",
                property_counts: {
                    sell: item.sell_properties_count || 0,
                    rent: item.rent_properties_count || 0,
                    project: item.projects_count || 0,
                    pool_projects_count: item.pool_projects_count || 0,
                },
                city: item.city,
                latitude: item.latitude,
                longitude: item.longitude,
                assigned_agents: item.assigned_agents || [],
            })),
            totalAreas: data.total || 0,
        };
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getAreasWithoutCount(fetchAll, signal) {
    let url = `${getApiUrl()}/properties/get_areas?size=${fetchAll ? 1000 : 10}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            signal,
        });

        if (!res.ok) throw new Error("Could not get areas!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function uploadAreaImage(id, imageFile) {
    const url = `${getApiUrl()}/properties/areas/${id}/upload_img`;

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: formData,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Failed to update image!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function bulkAssignedAreas(payload) {
    const url = `${getApiUrl()}/properties/bulk-assign_areas`;
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
        if (!res.ok) throw new Error("Could not assigned agent to owner!");
        return await res.json();
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function bulkAssignedCommunity(name, payload) {
    const url = `${getApiUrl()}/locations/communities/${name}/assign_agents`;
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
        if (!res.ok) throw new Error("Could not assigned agent to owner!");
        return await res.json();
    } catch (error) {
        throw new Error(error.message);
    }
}
