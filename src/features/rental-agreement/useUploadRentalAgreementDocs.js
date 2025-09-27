import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { uploadRentalAgreementDocs } from "../../services/apiRentalAgreeMent";
export function useUploadRentalAgreementDocs() {
    const queryClient = useQueryClient();

    const {
        mutate: uploadDocs,
        isPending,
        error,
    } = useMutation({
        mutationFn: ({ rentalAgreementId, files }) =>
            uploadRentalAgreementDocs(rentalAgreementId, files),
        onSuccess: () => {
            // Invalidate and refetch tenant documents
            queryClient.invalidateQueries(["rental-agreement", "rental-agreement-list"]);
            toast.success("Documents uploaded successfully");
        },
        onError: (error) => {
            console.error("Error uploading documents:", error);
            toast.error(error.message || "Failed to upload documents");
        },
    });

    return { uploadDocs, isPending, error };
}
