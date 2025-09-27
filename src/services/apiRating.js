import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";
const cookies = new Cookies();

export async function getRating(ratingType) {
    const url = `${getApiUrl()}/ratings?rating_type=${ratingType}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error(`Error fetching ratings: ${res.statusText}`);

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(`Error in getRating: ${err.message}`);
    }
}

async function createRating(payload) {
    const url = `${getApiUrl()}/ratings`;
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
        if (!res.ok) throw new Error(`Error creating rating: ${res.statusText}`);
    } catch (err) {
        throw new Error(`Error in createRating: ${err.message}`);
    }
}

export async function createMultipleRatings(ratingsArr) {
    try {
        if (ratingsArr?.length) {
            await Promise.all(
                ratingsArr.map((ratingObj) => createRating(ratingObj))
            );
        }
    } catch (err) {
        throw new Error(`Error in createMultipleRatings: ${err.message}`);
    }
}

async function updateRating(id, payload) {
    const url = `${getApiUrl()}/ratings/${id}`;

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
        if (!res.ok) throw new Error(`Error updating rating: ${res.statusText}`);
    } catch (err) {
        throw new Error(`Error in updateRating: ${err.message}`);
    }
}

export async function updateMultipleRatings(ratingsArr) {
    try {
        if (ratingsArr?.length) {
            await Promise.all(
                ratingsArr.map((ratingObj) =>
                    updateRating(ratingObj.id, ratingObj)
                )
            );
        }
    } catch (err) {
        throw new Error(`Error in updateMultipleRatings: ${err.message}`);
    }
}

export async function deleteRating(id) {
    const url = `${getApiUrl()}/ratings/${id}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error(`Error deleting rating: ${res.statusText}`);
    } catch (err) {
        throw new Error(`Error in deleteRating: ${err.message}`);
    }
}
