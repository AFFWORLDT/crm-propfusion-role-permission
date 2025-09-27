import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRentalAgreementDocument } from "../../services/apiRentalAgreeMent";
import { toast } from "react-hot-toast";
export function useDeleteRentalAgreementDocs() {
    const queryClient = useQueryClient();

    const { mutate: deleteDocs, isPending, error } = useMutation({
        mutationFn: ({ rentalAgreementId, documentUrl }) => deleteRentalAgreementDocument(rentalAgreementId, documentUrl),
        onSuccess: () => {
            queryClient.invalidateQueries(["rental-agreement", "rental-agreement-list"]);
            toast.success("Documents deleted successfully");
        },
        onError: (error) => {
            console.error("Error deleting documents:", error);
        },
    });

    return { deleteDocs, isPending, error };

}   
