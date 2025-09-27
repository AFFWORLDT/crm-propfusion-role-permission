import { useMutation } from "@tanstack/react-query";
import { uploadBulkPropertiesExcel } from "../../../services/apiExcel";
import toast from "react-hot-toast";

export function useUploadBulkPropertiesWithExcel() {
    const { data, isPending, mutate } = useMutation({
        mutationFn: (file) => uploadBulkPropertiesExcel(file),
        onError: (err) => toast.error(err.message),
        onSuccess: () => toast.success("Successfully uploaded!"),
    });

    return { data, isPending, mutate };
}
