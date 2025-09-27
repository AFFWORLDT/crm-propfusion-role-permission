import { getApiUrl } from "../utils/getApiUrl";
import Cookies from "universal-cookie";
import { checkUnauthorized } from "../utils/utils";
import { PROPERTY_MEDIA_API_FOLDER_NAME } from "../utils/constants";
import useImagesStore, { useDocumentsStore, useSingleImageStore } from "../store/imagesStore";

const cookies = new Cookies();
export async function uploadFile(
    files,
    folder = PROPERTY_MEDIA_API_FOLDER_NAME,
    agent_id
) {
    const url = `${getApiUrl()}/extra/upload_file?folder=${folder}`;
    console.log(agent_id, "agent_id");
    try {
        // Convert single file to array format
        const fileArray =
            files instanceof FileList || Array.isArray(files)
                ? Array.from(files)
                : [files];

        const uploadPromises = fileArray.map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            if (agent_id) {
                formData.append("agent_id", agent_id);
            }
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
            if (
                folder === PROPERTY_MEDIA_API_FOLDER_NAME ||
                folder === "tenants"
            ) {
                // Use Zustand store instead of localStorage
                const { addImage } = useImagesStore.getState();
                addImage(data.url);
                return data.url;
            } else {
                const { setDocument, addArrayDocument } =
                    useDocumentsStore.getState();
                // Handle array-type documents differently
                if (
                    [
                        "handover_documents",
                        "other_documents",
                        "management_contract",
                        "tenancy_lease_contract",
                        "title_deed",
                        "affection_plan",
                        "poa_noc",
                        "building_drawing",
                    ].includes(folder)
                ) {
                    addArrayDocument(folder, data.url);
                } else {
                    setDocument(folder, data.url);
                }
            }

            return data;
        });

        const results = await Promise.all(uploadPromises);
        return results;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function uploadFileV2(files, folder) {
    const url = `${getApiUrl()}/extra/upload_file?folder=${folder}`;

    try {
        // Convert single file to array format
        const fileArray =
            files instanceof FileList || Array.isArray(files)
                ? Array.from(files)
                : [files];

        const uploadPromises = fileArray.map(async (file) => {
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
            const { addImage } = useImagesStore.getState();
            if (data.url) {
                addImage(data.url);
            }
            return data.url;
        });

        const results = await Promise.all(uploadPromises);
        return results;
    } catch (err) {
        throw new Error(err.message);
    }
}
export async function deleteBlob(blobUrl) {
    const url = `${getApiUrl()}/extra/delete_blobs`;

    try {
        const res = await fetch(url, {
            method: "DELETE",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${cookies.get("USER").access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                blobUrl: Array.isArray(blobUrl) ? blobUrl : [blobUrl],
            }),
        });

        checkUnauthorized(res.status, cookies);

        if (!res.ok) throw new Error("Could not delete file!");

        const data = await res.json();
        return data;
    } catch (err) {
        throw new Error(err.message);
    }
}

export async function uploadObdReportFile(files, folder) {
    const url = `${getApiUrl()}/extra/upload_file?folder=${folder}`;
    const { setImage } = useSingleImageStore.getState()
    try {
        // Convert single file to array format
        const fileArray =
            files instanceof FileList || Array.isArray(files)
                ? Array.from(files)
                : [files];

        // Only process the last file to ensure we're always replacing with most recent
        const lastFile = fileArray[fileArray.length - 1];

        const formData = new FormData();
        formData.append("file", lastFile);

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

        if (data.url) {
            setImage(data?.url)
        }

        return data.url;
    } catch (err) {
        throw new Error(err.message);
    }
}