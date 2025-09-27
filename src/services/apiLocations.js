import axios from "axios";
import { getApiUrl } from "../utils/getApiUrl";

export const fetchLocations = async (search = "", page = 1, size = 1000) => {
    try {
        const API_URL = getApiUrl();
        const response = await axios.get(`${API_URL}/support/locations`, {
            params: {
                search,
                page,
                size,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching locations:", error);
        throw error;
    }
};

export async function getLocationWihLocationType(search, type) {
    const response = await fetch(
        `${getApiUrl()}/locations/locations/list?location_type=${type}&search=${search ?? ""}&page=1&size=10`
    );
    const data = await response.json();

    if (!response.ok) {
        throw new Error("Couldn't fetch locations!");
    }

    return data?.locations ?? [];
}
export async function getLocation(
    type,
    search,
    city,
    community,
    sub_community
) {
    const response = await fetch(
        `${getApiUrl()}/locations/locations/list?location_type=${type}&search=${search ?? ""}&page=1&size=10&city=${city ?? ""}&community=${community ?? ""}&sub_community=${sub_community ?? ""}`
    );
    const data = await response.json();

    if (!response.ok) {
        throw new Error("Couldn't fetch locations!");
    }

    return data?.locations ?? [];
}
