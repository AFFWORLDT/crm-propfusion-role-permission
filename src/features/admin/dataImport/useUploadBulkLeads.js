import { useMutation } from "@tanstack/react-query";
import { uploadBulkLeadsExcel } from "../../../services/apiExcel";
import toast from "react-hot-toast";

export function useUploadBulkLeads() {
    const { mutate, isLoading, error } = useMutation({
        mutationFn: (file) => uploadBulkLeadsExcel(file),
        onSuccess: () => {
            toast.success("Bulk leads uploaded successfully!");
        },
        onError: (err) => {
            toast.error("Upload failed: " + err.message);
        },
    });

    return { upload: mutate, isLoading, error };
}
