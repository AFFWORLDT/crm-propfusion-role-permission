import { getApiUrl } from "../utils/getApiUrl";
import { checkUnauthorized } from "../utils/utils";
import Cookies from "universal-cookie";

const cookies = new Cookies();

// Transaction Types
export const TransactionType = {
    PROPERTY_TRANSACTION: "property_transaction",
    INTERNAL_TRANSACTION: "internal_transaction"
};

export const InternalTransactionType = {
    AGENT_SALARY: "agent_salary",
    AGENT_PENALTY: "agent_penalty",
    COMPANY_INCOME: "company_income",
    COMPANY_EXPENSE: "company_expense"
};

export const PropertyTransactionPurpose = {
    OFFPLAN_PRIMARY: "offplan_primary",
    SECONDARY: "secondary",
    RENT: "rent"
};

// Agent Salary enums
export const SalaryType = {
    FIXED: "fixed",
    COMMISSION_BASED: "commission_based",
};

export const SalaryPeriod = {
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    YEARLY: "yearly",
};

// Agent Penalty enums
export const PenaltyType = {
    LATE_SUBMISSION: "late_submission",
    ABSENCE: "absence",
    MISCONDUCT: "misconduct",
    OTHER: "other",
};

// Company Revenue enums
export const RevenueType = {
    SERVICE_FEE: "service_fee",
    COMMISSION: "commission",
    ADVERTISING: "advertising",
    INTEREST: "interest",
    OTHER: "other",
};

// Company Expense enums
export const ExpenseType = {
    RENT: "rent",
    UTILITIES: "utilities",
    MARKETING: "marketing",
    SALARIES: "salaries",
    OFFICE_SUPPLIES: "office_supplies",
    OTHER: "other",
};

// Get transactions with filters
export async function getTransactions(filters = {}) {
    const params = new URLSearchParams();
    
    // Add filters to params
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
            params.append(key, value);
        }
    });

    const url = `${getApiUrl()}/transaction?${params.toString()}`;
    
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });
        
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not fetch transactions!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

// Get single transaction by ID
export async function getTransactionById(transactionId) {
    const url = `${getApiUrl()}/transaction/${transactionId}`;
    
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });
        
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not fetch transaction!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

// Create new transaction
export async function createTransaction(transactionData) {
    const url = `${getApiUrl()}/transaction`;
    
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(transactionData),
        });
        
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not create transaction!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

// Update transaction
export async function updateTransaction(transactionId, transactionData) {
    const url = `${getApiUrl()}/transaction/${transactionId}`;
    
    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(transactionData),
        });
        
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not update transaction!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

// Delete transaction
export async function deleteTransaction(transactionId) {
    const url = `${getApiUrl()}/transaction/${transactionId}`;
    
    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });
        
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not delete transaction!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

// Approve transaction
export async function approveTransaction(transactionId) {
    const url = `${getApiUrl()}/transaction/${transactionId}/approve`;
    
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });
        
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not approve transaction!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

// Upload transaction document
export async function uploadTransactionDocument(transactionId, party, file) {
    const url = `${getApiUrl()}/transaction/${transactionId}/upload_document`;
    
    const formData = new FormData();
    formData.append('party', party);
    formData.append('file', file);
    
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: formData,
        });
        
        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not upload document!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
