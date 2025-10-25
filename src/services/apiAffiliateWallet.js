import Cookies from "universal-cookie";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();
const API_URL = getApiUrl();

const defaultHeaders = {
    Accept: "application/json",
    Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
};

export async function getDashboardStats() {
    const url = `${API_URL}/properties/dashboard_stats`;
    
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: defaultHeaders,
        });

        if (!res.ok) throw new Error("Could not fetch dashboard stats!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getAgentWalletBalance() {
    const url = `${API_URL}/agent-wallet/me/balance`;
    
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: defaultHeaders,
        });

        if (!res.ok) throw new Error("Could not fetch wallet balance!");

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
            headers: defaultHeaders,
        });

        if (!res.ok) throw new Error("Could not fetch wallet transactions!");

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
            headers: defaultHeaders,
        });

        if (!res.ok) throw new Error("Could not fetch payouts!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getWalletSummary() {
    try {
        const [dashboardData, walletData, transactionsData, payoutsData] = await Promise.all([
            getDashboardStats().catch(() => null),
            getAgentWalletBalance().catch(() => null),
            getAgentWalletTransactions(1, 5).catch(() => null),
            getAgentPayouts(1, 5).catch(() => null)
        ]);

        return {
            dashboard: dashboardData,
            wallet: walletData,
            transactions: transactionsData,
            payouts: payoutsData,
            totalBalance: walletData?.current_balance || 0
        };
    } catch (err) {
        throw new Error(err.message);
    }
}
