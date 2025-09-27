import Cookies from "universal-cookie";
import { buildUrl, checkUnauthorized } from "../utils/utils";

const cookies = new Cookies();

export async function getGCalendarEvents(filters, fetchAll = false) {
    const url = `${buildUrl("calendars/events", filters, fetchAll)}`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get GCalendar events!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
