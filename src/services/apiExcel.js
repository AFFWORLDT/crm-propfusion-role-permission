import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
import { getApiUrl } from "../utils/getApiUrl";
import toast from "react-hot-toast";

const cookies = new Cookies();

export async function getPropertyExcelExample() {
    const url = `${getApiUrl()}/support/download_example_excel`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not get Export Excel example!");

        // Get the binary content as a blob
        const blob = await res.blob();

        // Create a URL for the blob
        const downloadUrl = window.URL.createObjectURL(blob);

        // Create a download link and trigger download
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "example.xlsx"; // Set default filename
        document.body.appendChild(link);
        link.click();

        // Clean up the link and revoke URL
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        toast.success("Successfully downloaded Property Excel example!");

        return true;
    } catch (err) {
        console.error("Download error:", err);
        throw new Error(err.message || "Failed to download Excel file.");
    }
}


export async function uploadBayutExcelsheet(file) {
    const url = `${getApiUrl()}/support/import_bayut_dubizzle_excel`;

    const formData = new FormData();
    formData.append("file", file);

    const user = cookies.get("USER");
    if (!user || !user.access_token) {
        throw new Error("User not authenticated or access token missing.");
    }

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${user.access_token}`,
            },
            body: formData,
        });

        checkUnauthorized(res.status, cookies);

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Upload failed");
        }

        return res;
    } catch (err) {
        console.error("Error uploading Bayut excelsheet:", err);
        throw new Error(err.message || "An unexpected error occurred.");
    }
}

export async function uploadBulkPropertiesExcel(file) {
    const url = `${getApiUrl()}/support/bulk_upload_properties`;

    const formData = new FormData();
    formData.append("file", file);

    const user = cookies.get("USER");
    if (!user || !user.access_token) {
        throw new Error("User not authenticated or access token missing.");
    }

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${user.access_token}`,
            },
            body: formData,
        });

        checkUnauthorized(res.status, cookies);

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Upload failed");
        }

        return res;
    } catch (err) {
        console.error("Error uploading bulk properties:", err);
        throw new Error(err.message || "An unexpected error occurred.");
    }
}

export async function getExportExcelProperties() {
    const url = `${getApiUrl()}/support/export_properties`;
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
            },
        });

        checkUnauthorized(res.status, cookies);
        if (!res.ok) throw new Error("Could not export Excel file!");

        const blob = await res.blob();

        const urlBlob = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = urlBlob;
        a.download = "exported_properties.xlsx";
        a.click();
        window.URL.revokeObjectURL(urlBlob);
    } catch (err) {
        console.log(err);

        toast.error("Export failed: " + err.message);
    }
}

export async function exportLeads() {
    const url = `${getApiUrl()}/support/export_leads`;
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
            },
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Export Failed Response:", errorText);
            throw new Error("Failed to export leads. Please try again.");
        }

        // Process and download the Excel file
        const blob = await res.blob();
        const fileURL = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = fileURL;
        a.download = "leads_export.xlsx"; // Customize the download filename
        a.click();
        window.URL.revokeObjectURL(fileURL);

      
    } catch (err) {
      
        toast.error("Export failed: " + err.message);
    }
}

export async function downloadLeadsTemplate() {
    const url = `${getApiUrl()}/support/download_leads_template`;
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${cookies.get("USER")?.access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Template Download Failed:", errorText);
            throw new Error(
                "Failed to download leads template. Please try again."
            );
        }

        // Process and download the Excel template
        const blob = await res.blob();
        const fileURL = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = fileURL;
        a.download = "leads_template.xlsx";
        a.click();
        window.URL.revokeObjectURL(fileURL);

    } catch (err) {
        toast.error("Download failed: " + err.message);
    }
}

export async function uploadBulkLeadsExcel(file) {
    const url = `${getApiUrl()}/support/bulk_upload_leads`;

    const formData = new FormData();
    formData.append("file", file);

    const user = cookies.get("USER");
    if (!user || !user.access_token) {
        throw new Error("User not authenticated or access token missing.");
    }

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${user.access_token}`,
            },
            body: formData,
        });

        checkUnauthorized(res.status, cookies);

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Upload failed");
        }

        return res;
    } catch (err) {

        throw new Error(err.message || "An unexpected error occurred.");
    }
}