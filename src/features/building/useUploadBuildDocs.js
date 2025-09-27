import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "../../services/apiExtra";
import toast from "react-hot-toast";

export function useUploadBuildDocs(folder) {
    const {
        mutate: upload,
        isPending: isUploading,
        error: uploadError,
        data: uploadedData,
    } = useMutation({
        mutationFn: (files) => uploadFile(files, folder),
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
