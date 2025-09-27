import { buildUrl } from "../utils/utils";

export async function getAmenities(filters = {}) {
    const url = buildUrl("properties/amenities", filters, true);

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        });

        if (!res.ok) throw new Error("Could not get amenities!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
