import axiosInstance from "../utils/axiosInstance";

export async function getQrCodeSettings() {
    try {
        const { data } = await axiosInstance.get("/qr-code-settings");
        return data;
    } catch (error) {
        throw new Error("Failed to fetch QR code settings");
    }
}

export async function updateQrCodeSettings(settings) {
    try {
        const formData = new FormData();

        // Append all settings to formData
        Object.keys(settings).forEach((key) => {
            if (key === "qr_code_url" && settings[key] instanceof FileList) {
                formData.append(key, settings[key][0]);
            } else {
                formData.append(key, settings[key]);
            }
        });

        const { data } = await axiosInstance.post("/qr-code-settings", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    } catch (error) {
        throw new Error("Failed to update QR code settings");
    }
} 