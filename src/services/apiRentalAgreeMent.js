import Cookies from "universal-cookie";
import { buildUrl, checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";

const cookies = new Cookies();

export async function getAllRentalAgreementPaymentReport(
    filters,
    fetchAll = false,
    signal
) {
    const url = buildUrl(
        "properties/rental-agreements/payment-report",
        filters,
        fetchAll
    );
    try {
        const res = await fetch(url, {
            method: "GET",

            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
            signal,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get Rental Agreement!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getAllRentalAgreement(filters, fetchAll = false) {
    const url = buildUrl("rental-agreements", filters, fetchAll);
    try {
        const res = await fetch(url, {
            method: "GET",

            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get Rental Agreement!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function createRentalAgreement(payload) {
    const url = `${getApiUrl()}/rental-agreements`;
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: JSON.stringify({ ...payload }),
        });

        checkUnauthorized(res.status, cookies);
        const data = await res.json();

        if (!res.ok) throw new Error(data.detail);

        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function getRentalAgreementById(id) {
    const url = `${getApiUrl()}/rental-agreements/${id}`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get Rental Agreement!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function uploadRentalAgreementDocs(rentalAgreementId, files) {
    const url = `${getApiUrl()}/rental-agreements/${rentalAgreementId}/upload_docs`;
    try {
        const formData = new FormData();

        // Append multiple files to formData
        files.forEach((file) => {
            formData.append("docs", file);
        });

        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
                // Note: Don't set Content-Type header when using FormData,
                // browser will set it automatically with correct boundary
            },
            body: formData,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Failed to upload documents");

        const data = await res.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function deleteRentalAgreementDocument(
    rentalAgreementId,
    documentUrl
) {
    const url = `${getApiUrl()}/rental-agreements/${rentalAgreementId}/document?document_url=${documentUrl}`;
    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok)
            throw new Error("Could not delete rental agreement document!");

        return true;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function updateRentalAgreement(id, payload) {
    const url = `${getApiUrl()}/rental-agreements/${id}`;
    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
            body: JSON.stringify({ ...payload }),
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok)
            throw new Error("Could not update rental agreement status!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function uploadChequePaymentReceipt(file, folder) {
    const url = `${getApiUrl()}/extra/upload_file?folder=${folder}`;

    try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
            body: formData,
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not upload file!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}
