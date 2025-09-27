import axiosInstance from "../utils/axiosInstance";

import Cookies from "universal-cookie";
import { buildUrl, checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";
import { error } from "pdf-lib";
import toast from "react-hot-toast";

const cookies = new Cookies();

export async function getKpiLists(filters, fetchAll = false, signal) {
    const url = buildUrl("kpi/submissions", filters, fetchAll);

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            signal,
        });

        checkUnauthorized(res.status, cookies);

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getKpiSubmissions(page = 1, size = 10) {
    const response = await axiosInstance.get(
        `/kpi/submissions?page=${page}&size=${size}`
    );
    return response.data;
}

export async function createKpiSubmission(data) {
    const url = `${getApiUrl()}/kpi/submissions`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        checkUnauthorized(res.status, cookies);

        const responseData = await res.json();

        if (!res.ok) {
            const errorMessage =
                responseData.detail ||
                responseData.message ||
                "Failed to create KPI submission";

            return {
                success: false,
                error: errorMessage,
                data: responseData,
            };
        }

        return {
            success: true,
            data: responseData,
        };
    } catch (err) {
        console.error("Error creating KPI submission:", err);
        return {
            success: false,
            error: err.message || "Failed to create KPI submission"
        };
    }
}


export const updateKpiSubmission = async (id, submissionData) => {
    const url = `${getApiUrl()}/kpi/submissions/${id}`;

    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify(submissionData),
        });

        checkUnauthorized(res.status, cookies);

        const data = await res.json();

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
};

export async function getKpiSubmissionById(id) {
    const url = `${getApiUrl()}/kpi/submissions/${id}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                error: data.message || "Failed to fetch KPI submission",
                data: data,
            };
        }

        return {
            success: true,
            data: data,
        };
    } catch (err) {
        console.error("Error fetching KPI submission:", err);
        throw new Error(err.message || "Failed to fetch KPI submission");
    }
}

export async function deleteKpiSubmission(id) {
    const url = `${getApiUrl()}/kpi/submissions/${id}`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                error: data.message || "Failed to delete KPI submission",
                data: data,
            };
        }

        return {
            success: true,
            data: data,
        };
    } catch (err) {
        console.error("Error deleting KPI submission:", err);
        throw new Error(err.message || "Failed to delete KPI submission");
    }
}
