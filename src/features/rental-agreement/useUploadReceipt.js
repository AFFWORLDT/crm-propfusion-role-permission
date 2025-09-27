import { useMutation } from "@tanstack/react-query";
import { uploadChequePaymentReceipt } from "../../services/apiRentalAgreeMent";
import toast from "react-hot-toast";

export function useUploadReceipt(folder) {
    const {
        mutateAsync: upload,
        isPending: isUploading,
        error: uploadError,
        data: uploadedData,
    } = useMutation({
        mutationFn: async (file) => {
            const result = await uploadChequePaymentReceipt(file, folder);
            return result;
        },
        onSuccess: (data) => {
            toast.success("Receipt uploaded successfully");
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
