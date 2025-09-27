import { getApiUrl } from "../utils/getApiUrl";

export async function loginApi(credentials) {
    try {
        const res = await fetch(`${getApiUrl()}/api/login`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(credentials),
        });

        const data = await res.json();
        
        if (res.ok) {
            return data;
        } else {
            // Handle different status codes
            if (res.status === 403) {
                throw new Error("Invalid username or password");
            } else {
                throw new Error(data.message || "Something went wrong. Please try again later.");
            }
        }
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getSubscriptionStatus() {
    try {
        const res = await fetch(
            `${getApiUrl()}/integration/subscription_status`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            }
        );

        if (!res.ok) throw new Error("Could not get subscription status!");

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
