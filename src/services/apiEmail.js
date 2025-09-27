import Cookies from "universal-cookie";
import { getApiUrl } from "../utils/getApiUrl";
import { checkUnauthorized } from "../utils/utils";


const cookies = new Cookies();

export async function sendmail(payload) {
    const url = `${getApiUrl()}/api/email_manager/send_email`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify({...payload}),
        });

        checkUnauthorized(res.status, cookies);
        // const data = await res.json();
          
        if (!res.ok)
            throw new Error("");

    } catch (err) {
        throw new Error(err.message);
    }
}
export async function sendcampinmail(payload) {
    const url = `${getApiUrl()}/api/email_manager/send_campaign`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify({...payload}),
        });

        checkUnauthorized(res.status, cookies);
        // const data = await res.json();
          
        if (!res.ok)
            throw new Error("");

    } catch (err) {
        throw new Error(err.message);
    }
}
