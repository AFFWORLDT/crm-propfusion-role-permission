import { getApiUrl } from "../utils/getApiUrl";
import { buildUrl, checkUnauthorized } from "../utils/utils";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export async function createDeveloper(data) {
    const url = `${getApiUrl()}/properties/add_developer_with_logo`;
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("logo", data.logo);

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

export async function getDevelopers(filters, fetchAll, signal) {
    const url = buildUrl(
        "properties/get_developers_with_property_counts",
        filters,
        fetchAll
    );

    try {
        let user = cookies.get("USER");
        if (!user) {
            const localUser = localStorage.getItem("CRMUSER");
            if (localUser) {
                user = JSON.parse(localUser);
            }
        }

        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${user?.access_token}`,
            },
            signal,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get developers!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getDevelopersWithoutCount(search, fetchAll, signal) {
    let url = `${getApiUrl()}/properties/get_developers?size=${fetchAll ? 1000 : 10}&name=${search}`;

    try {
        let user = cookies.get("USER");
        if (!user) {
            const localUser = localStorage.getItem("CRMUSER");
            if (localUser) {
                user = JSON.parse(localUser);
            }
        }

        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${user?.access_token}`,
            },
            signal,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get developers!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
export async function getDevelopersFlters(search) {
    let url = `${getApiUrl()}/properties/get_developers?size=10&name=${search ?? ""}`;

    try {
        let user = cookies.get("USER");
        if (!user) {
            const localUser = localStorage.getItem("CRMUSER");
            if (localUser) {
                user = JSON.parse(localUser);
            }
        }

        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${user?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get developers!");

        const data = await res.json();

        return data?.developers;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function uploadDeveloperImage(id, imageFile) {
    const url = `${getApiUrl()}/properties/developers/${id}/upload_logo`;

    const formData = new FormData();
    formData.append("logo", imageFile);

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
        if (!res.ok) throw new Error("Failed to update logo!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function bulkAssignedDeveloper(payload) {
    const url = `${getApiUrl()}/properties/bulk-assign_developers`;
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

export async function uploadDeveloperDocs(developerId, docs) {
    const url = `${getApiUrl()}/properties/developers/${developerId}/upload_documents`;

    const formData = new FormData();

    Array.from(docs).forEach((file) => {
        formData.append("documents", file);
    });

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
        if (!res.ok) throw new Error("Failed to upload documents!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteDeveloperDocs(developerId, docUrls) {
    const url = `${getApiUrl()}/properties/developers/${developerId}/documents`;

    // Convert docUrls array to query string
    const queryParams = docUrls
        .map((url) => `document_urls=${encodeURIComponent(url)}`)
        .join("&");
    const fullUrl = `${url}?${queryParams}`;

    try {
        const res = await fetch(fullUrl, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete documents!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function searchDevelopers(name, signal) {
    let url = `${getApiUrl()}/properties/get_developers`;

    if (name) {
        url += `?name=${encodeURIComponent(name)}&size=20`;
    } else {
        url += `?size=20`;
    }

    try {
        let user = cookies.get("USER");
        if (!user) {
            const localUser = localStorage.getItem("CRMUSER");
            if (localUser) {
                user = JSON.parse(localUser);
            }
        }

        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${user?.access_token}`,
            },
            signal,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not search developers!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getDeveloperById(id) {
    const url = `${getApiUrl()}/properties/developers/${id}`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${cookies.get("USER").access_token}`,
        },
    });

    if (!res.ok) throw new Error("Could not get developer!");

    const data = await res.json();

    return data?.developer;
}
