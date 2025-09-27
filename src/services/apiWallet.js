import Cookies from "universal-cookie";
import { getApiUrl } from "../utils/getApiUrl";
import { checkUnauthorized } from "../utils/utils";

const cookies = new Cookies();
const API = getApiUrl();

async function request(path, options = {}) {
    const url = `${API}${path}`;
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.get("USER")?.access_token || ""}`,
        ...(options.headers || {}),
    };

    const res = await fetch(url, { ...options, headers });
    checkUnauthorized(res.status, cookies);
    const isJson = (res.headers.get("content-type") || "").includes("application/json");
    if (!res.ok) {
        let message = "Request failed";
        if (isJson) {
            const err = await res.json().catch(() => ({}));
            message = err?.detail || err?.message || err?.error || message;
        } else {
            message = await res.text().catch(() => message);
        }
        const error = new Error(message);
        error.status = res.status;
        throw error;
    }
    return isJson ? res.json() : res.text();
}

export const walletApi = {
    getWallet() {
        return request("/wallet", { method: "GET" });
    },
    getSummary() {
        return request("/wallet/summary", { method: "GET" });
    },
    getServices() {
        return request("/wallet/services", { method: "GET" }).then((data) => data?.items ?? data ?? []);
    },
    createTopupIntent({ amount, currency }) {
        const frontendUrl = `${window.location.origin}/billing`;
        return request("/wallet/topup/intent", {
            method: "POST",
            body: JSON.stringify({ amount, currency, frontend_url: frontendUrl }),
        });
    },
    subscribeWallet({ service_id, auto_renew }) {
        const frontendUrl = `${window.location.origin}/billing`;
        return request(`/wallet/subscribe`, {
            method: "POST",
            body: JSON.stringify({
                payload: { service_id, auto_renew },
                payment_method: "wallet",
                frontend_url: frontendUrl,
            }),
        });
    },
    subscribeStripe({ service_id, auto_renew }) {
        const frontendUrl = `${window.location.origin}/billing`;
        return request(`/wallet/subscribe`, {
            method: "POST",
            body: JSON.stringify({
                payload: { service_id, auto_renew },
                payment_method: "stripe",
                frontend_url: frontendUrl,
            }),
        });
    },
    getSubscriptions(status_filter = "active") {
        const q = status_filter ? `?status_filter=${encodeURIComponent(status_filter)}` : "";
        return request(`/wallet/subscriptions${q}`, { method: "GET" }).then((data) => data?.items ?? data ?? []);
    },
    cancelSubscription(subscription_id) {
        return request(`/wallet/subscriptions/${subscription_id}/cancel`, { method: "PUT" });
    },
    setAutoRenew(subscription_id, enabled) {
        return request(`/wallet/subscriptions/${subscription_id}/autorenew`, {
            method: "PUT",
            body: JSON.stringify({ enabled }),
        });
    },
    getTransactions(page = 1, size = 10) {
        const params = new URLSearchParams({ page: String(page), size: String(size) });
        return request(`/wallet/transactions?${params.toString()}`, { method: "GET" });
    },
    purchase({ name, amount, currency, payment_method }) {
        const frontendUrl = `${window.location.origin}/billing`;
        return request(`/wallet/purchase`, {
            method: "POST",
            body: JSON.stringify({ name, amount, currency, payment_method, frontend_url: frontendUrl }),
        });
    },
};


