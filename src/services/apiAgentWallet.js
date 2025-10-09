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

export const agentWalletApi = {
    // Get agent wallet balance
    getAgentWalletBalance(agentId) {
        return request(`/agent-wallet/balance/${agentId}`, { method: "GET" });
    },

    // Get agent wallet transactions
    getAgentWalletTransactions(agentId, page = 1, size = 10) {
        return request(`/agent-wallet/transactions?agent_id=${agentId}&page=${page}&size=${size}`, { method: "GET" });
    },

    // Get agent wallet payouts with filters
    getAgentWalletPayouts(filters = {}) {
        const params = new URLSearchParams();
        
        params.append('page', filters.page || 1);
        params.append('size', filters.size || 10);
        
        if (filters.status_filter) {
            params.append('status_filter', filters.status_filter);
        }
        
        if (filters.agent_id) {
            params.append('agent_id', filters.agent_id);
        }

        return request(`/agent-wallet/payouts?${params.toString()}`, { method: "GET" });
    },

    // Decide payout request (approve/reject)
    decidePayoutRequest(requestId, approve, note = "") {
        return request(`/agent-wallet/payouts/${requestId}/decide`, {
            method: "POST",
            body: JSON.stringify({ approve, note })
        });
    },

    // Get all transactions with filters
    getAllTransactions(filters = {}) {
        const params = new URLSearchParams();
        
        params.append('page', filters.page || 1);
        params.append('size', filters.size || 10);
        
        if (filters.agent_id) {
            params.append('agent_id', filters.agent_id);
        }
        
        if (filters.type_filter) {
            params.append('type_filter', filters.type_filter);
        }

        return request(`/agent-wallet/admin/all-transactions?${params.toString()}`, { method: "GET" });
    },

    // Get all wallets with filters
    getAllWallets(filters = {}) {
        const params = new URLSearchParams();
        
        params.append('page', filters.page || 1);
        params.append('size', filters.size || 10);
        
        if (filters.min_balance) {
            params.append('min_balance', filters.min_balance);
        }
        
        if (filters.max_balance) {
            params.append('max_balance', filters.max_balance);
        }

        return request(`/agent-wallet/admin/all-wallets?${params.toString()}`, { method: "GET" });
    }
};
