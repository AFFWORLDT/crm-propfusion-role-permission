import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

export async function getTags(tagType) {
    const url = `${getApiUrl()}/tags?tag_type=${tagType}`;

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
        if (!res.ok) throw new Error("Could not get tags!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function createTag(payload) {
    const url = `${getApiUrl()}/tags`;

    try {
        let user = cookies.get("USER");
        if (!user) {
            const localUser = localStorage.getItem("CRMUSER");
            if (localUser) {
                user = JSON.parse(localUser);
            }
        }

        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.access_token}`,
            },
            body: JSON.stringify(payload),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not create tag!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createMultipleTags(tagsArr) {
    try {
        if (tagsArr?.length) {
            await Promise.all(tagsArr.map((tagObj) => createTag(tagObj)));
        }
    } catch (err) {
        throw new Error(err.message);
    }
}

async function updateTag(id, payload) {
    const url = `${getApiUrl()}/tags/${id}`;

    try {
        let user = cookies.get("USER");
        if (!user) {
            const localUser = localStorage.getItem("CRMUSER");
            if (localUser) {
                user = JSON.parse(localUser);
            }
        }

        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.access_token}`,
            },
            body: JSON.stringify(payload),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not update tag!");
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateMultipleTags(tagsArr) {
    try {
        if (tagsArr?.length) {
            await Promise.all(
                tagsArr.map((tagObj) => updateTag(tagObj.id, tagObj))
            );
        }
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function deleteTag(id) {
    const url = `${getApiUrl()}/tags/${id}`;

    try {
        let user = cookies.get("USER");
        if (!user) {
            const localUser = localStorage.getItem("CRMUSER");
            if (localUser) {
                user = JSON.parse(localUser);
            }
        }

        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${user?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete tag!");
    } catch (err) {
        throw new Error(err.message);
    }
}
