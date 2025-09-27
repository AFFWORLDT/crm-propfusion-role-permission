import Cookies from "universal-cookie";
import { buildUrl, checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

/**
 * Fetch transactions with optional filters
 * @param {Object} filters - Query parameters like purpose, lead_id, property_id, etc.
 * @param {AbortSignal} signal - AbortController signal for cancellation
 * @returns {Promise<Array>} - Array of transaction objects
 */
export async function getTransactions(filters = {}, signal) {
    try {
        const url = buildUrl("transaction/transactions", filters, true);
        console.log('Fetching transactions from:', url);

        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
            signal,
        });

        checkUnauthorized(res.status, cookies);
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Could not fetch transactions!");
        }

        const data = await res.json();
        console.log('Transactions response:', data);
        
        return data;
    } catch (err) {
        if (err.name === 'AbortError') {
            throw err;
        }
        console.error('Error fetching transactions:', err);
        throw new Error(err.message || "Failed to fetch transactions");
    }
}

/**
 * Create a new transaction
 * @param {Object} transactionData - Transaction data object
 * @returns {Promise<Object>} - Created transaction response
 */
export async function createTransaction(transactionData) {
    try {
        const url = `${getApiUrl()}/transaction/transactions`;
        console.log('Creating transaction:', transactionData);

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
            body: JSON.stringify(transactionData),
        });

        checkUnauthorized(res.status, cookies);
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Could not create transaction!");
        }

        const data = await res.json();
        console.log('Transaction created:', data);
        
        return data;
    } catch (err) {
        console.error('Error creating transaction:', err);
        throw new Error(err.message || "Failed to create transaction");
    }
}

/**
 * Get transaction by ID
 * @param {number} id - Transaction ID
 * @returns {Promise<Object>} - Transaction details
 */
export async function getTransactionById(id) {
    try {
        if (!id) {
            throw new Error("Transaction ID is required");
        }

        const url = `${getApiUrl()}/transaction/transactions?transaction_id=${id}`;
        console.log('Fetching transaction details:', url);

        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Could not fetch transaction details!");
        }

        const data = await res.json();
        console.log('Transaction details:', data);
        
        return data;
    } catch (err) {
        console.error('Error fetching transaction details:', err);
        throw new Error(err.message || "Failed to fetch transaction details");
    }
}

/**
 * Update an existing transaction
 * @param {number} id - Transaction ID
 * @param {Object} transactionData - Updated transaction data
 * @returns {Promise<Object>} - Updated transaction response
 */
export async function updateTransaction(id, transactionData) {
    try {
        if (!id) {
            throw new Error("Transaction ID is required");
        }

        const url = `${getApiUrl()}/transaction/transactions/${id}`;
        console.log('Updating transaction:', id, transactionData);

        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
            body: JSON.stringify(transactionData),
        });

        checkUnauthorized(res.status, cookies);
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Could not update transaction!");
        }

        const data = await res.json();
        console.log('Transaction updated:', data);
        
        return data;
    } catch (err) {
        console.error('Error updating transaction:', err);
        throw new Error(err.message || "Failed to update transaction");
    }
}

/**
 * Delete a transaction
 * @param {number} id - Transaction ID
 * @returns {Promise<Object>} - Deletion response
 */
export async function deleteTransaction(id) {
    try {
        if (!id) {
            throw new Error("Transaction ID is required");
        }

        const url = `${getApiUrl()}/transaction/transactions/${id}`;
        console.log('Deleting transaction:', id);

        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Could not delete transaction!");
        }

        const data = await res.json();
        console.log('Transaction deleted:', data);
        
        return data;
    } catch (err) {
        console.error('Error deleting transaction:', err);
        throw new Error(err.message || "Failed to delete transaction");
    }
} 