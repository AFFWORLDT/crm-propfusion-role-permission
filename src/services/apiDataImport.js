import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

export async function getPropertyFinderListings() {
    const url = `${getApiUrl()}/integration/import_property_from_propertyfinder`;
    //
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get Property Finder listings!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
