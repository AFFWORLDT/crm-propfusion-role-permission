import { useMutation } from "@tanstack/react-query";
import { uploadBayutExcelsheet } from "../../../services/apiExcel";
import toast from "react-hot-toast";

export function useUploadBayutExcelsheet() {
    const { mutate, isLoading, error } = useMutation({
        mutationFn: (file) => uploadBayutExcelsheet(file),
        onSuccess: () => {
            toast.success("Bayut excelsheet uploaded successfully!");
        },
        onError: (err) => {
            toast.error("Upload failed: " + err.message);
        },
    });

    return { uploadBayut: mutate, isLoading, error };
}
