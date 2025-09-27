import { useMutation } from "@tanstack/react-query";
import {
    uploadFile,
    uploadFileV2,
    uploadObdReportFile,
} from "../../services/apiExtra";
import toast from "react-hot-toast";

export function useUploadImage(folder) {
    const {
        mutate: upload,
        isPending: isUploading,
        error: uploadError,
        data: uploadedData,
    } = useMutation({
        mutationFn: ({ files, agent_id }) => uploadFile(files, folder, agent_id),
        onSuccess: () => {
            toast.success("File uploaded successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to upload file");
        },
    });

    return {
        upload,
        isUploading,
        uploadError,
        uploadedData,
    };
}
export function useUploadImageV2(folder) {
    const {
        mutate: upload,
        isPending: isUploading,
        error: uploadError,
        data: uploadedData,
    } = useMutation({
        mutationFn: (files) => uploadFileV2(files, folder),
        onSuccess: () => {
            toast.success("File uploaded successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to upload file");
        },
    });

    return {
        upload,
        isUploading,
        uploadError,
        uploadedData,
    };
}

export function useUploadObdFile(folder) {
    const {
        mutate: uploadMutation,
        isPending: isUploading,
        error: uploadError,
        data: uploadedData,
    } = useMutation({
        mutationFn: (files) => uploadObdReportFile(files, folder),
        onSuccess: () => {
            toast.success("File uploaded successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to upload file");
        },
    });

    // Create a wrapper for mutate that returns a Promise with the URL
    const upload = async (files) => {
        return new Promise((resolve, reject) => {
            uploadMutation(files, {
                onSuccess: (data) => {
                    resolve(data);
                },
                onError: (error) => {
                    reject(error);
                }
            });
        });
    };

    return {
        upload,
        isUploading,
        uploadError,
        uploadedData,
    };
}
