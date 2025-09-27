
import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";
const cookies = new Cookies();


export async function getCurrencyConversion(currency = "AED") {
    const url = `${getApiUrl()}/support/rates?base_currency=${currency}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get currency conversion!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}