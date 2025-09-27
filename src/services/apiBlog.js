import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

export async function getBlog(page, size) {
    const url = `${getApiUrl()}/blogs?page=${page}&size=${size}`;
    
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

export async function CreateBlog(payload) {
    const url = `${getApiUrl()}/blogs`;
    const formData = new FormData();
    for (const key in payload) {
        if (key === "photos" && Array.isArray(payload.photos)) {
            payload.photos.forEach((photo, index) => {
                if (photo instanceof File) {
                    formData.append(`photos[${index}]`, photo);
                } else {
                    console.error("Invalid file detected in photos array");
                }
            });
        } else if (payload[key] instanceof File) {
            formData.append(key, payload[key]);
        } else {
            formData.append(key, payload[key]);
        }
    }

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: formData, // Attach FormData directly
        });

        checkUnauthorized(res.status, cookies);
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail || "An error occurred");
        }

        return data; // Successfully return the response
    } catch (err) {
        throw new Error(err.message);
    }
}




export async function getBlogById(Id) {
    const url = `${getApiUrl()}/blogs?blog_id=${Id}`;

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


export const updateBlogApi = async (blogId, queryParams) => {
    try {
        const baseUrl = `${getApiUrl()}/blogs/${blogId}`;

        const filteredParams = Object.fromEntries(
            // eslint-disable-next-line no-unused-vars
            Object.entries(queryParams).filter(([_, value]) => value != null && value !== "")
        );

        const queryString = new URLSearchParams(filteredParams).toString();
        const fullUrl = `${baseUrl}?${queryString}`;
        const response = await fetch(fullUrl, {
            method: "PUT", 
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`, 
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Update failed: ${errorData?.message || response.statusText}`);
        }
        const data = await response.json();
        console.log("Blog updated successfully:", data); 
        return data;
    } catch (error) {
        console.error("Error updating blog:", error);
        throw new Error(error.message);
    }
};


export async function deleteBlog(id) {
    const url = `${getApiUrl()}/blogs/${id}`;

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



