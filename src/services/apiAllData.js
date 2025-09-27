import { getApiUrl } from "../utils/getApiUrl";
import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
const cookies = new Cookies();

export async function fetchCurrentLoggedInUserAllData() {
    const user = cookies.get("USER");
    if (!user) {
        throw new Error("No user found");
    }

    const url = `${getApiUrl()}/properties/all-data`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${user?.access_token}`,
            },
        });
        
        if (res.status === 401) {
            throw new Error("Unauthorized");
        }
        
        checkUnauthorized(res.status, cookies);
        
        if (!res.ok) {
            throw new Error("Could not fetch data");
        }
        
        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
