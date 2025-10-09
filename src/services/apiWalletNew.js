import Cookies from "universal-cookie";
import { getApiUrl } from "../utils/getApiUrl";
import axios from "axios";

const cookies = new Cookies();
const API_URL = getApiUrl();

const defaultHeaders = {
    Accept: "application/json",
    Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
};

export async function getAgentWalletBalance() {
    const url = `${API_URL}/agent-wallet/me/balance`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        if (!res.ok) throw new Error("Could not get vehicle!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getAgentWalletTransactions(page = 1, size = 10) {
    const url = `${API_URL}/agent-wallet/me/transactions?page=${page}&size=${size}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        if (!res.ok) throw new Error("Could not get vehicle!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getAgentPayouts(page = 1, size = 10) {
    const url = `${API_URL}/agent-wallet/me/payouts?page=${page}&size=${size}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        if (!res.ok) throw new Error("Could not get vehicle!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createPayout(data) {
    const url = `${API_URL}/agent-wallet/payouts`;

    try {
        const res = await axios.post(url, data, {
            headers: defaultHeaders,
            Authorization: `Bearer ${cookies.get("USER").access_token}`,
        });

        if (res.status !== 200) throw new Error("Could not create payout!");

        return res.data;
    } catch (err) {
        throw new Error(err.response?.data?.detail );
    }
}
