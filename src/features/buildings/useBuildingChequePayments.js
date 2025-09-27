import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRentalAgreement } from "../../services/apiRentalAgreeMent";
import toast from "react-hot-toast";
import { useDeleteImage } from "../Extra/useDeleteImage";
import { updateBuilding } from "../../services/apiBuilding";

export function useBuildingChequePayments() {
    const queryClient = useQueryClient();
    const { deleteImage } = useDeleteImage();

    const { mutate: addChequePayment, isPending: isAddingPayment } = useMutation({
        mutationFn: ({ buildingId   , chequePayments }) => 
            updateBuilding(buildingId, { cheque_payments: chequePayments }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["building"] });
            queryClient.invalidateQueries({ queryKey: ["building-list"] });
            toast.success("Payment added successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to add payment");
        },
    });

    const { mutate: deleteChequePayment, isPending: isDeletingPayment } = useMutation({
        mutationFn: ({ buildingId, chequePayments }) => 
            updateBuilding(buildingId, { cheque_payments: chequePayments }),
        onSuccess: (data,variables) => {
            queryClient.invalidateQueries({ queryKey: ["building"] });
            queryClient.invalidateQueries({ queryKey: ["building-list"] });
            toast.success("Payment deleted successfully");
            console.log(variables);
            
            deleteImage(variables.chequePayments.receipt_image);
            
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete payment");
        },
    });

    const { mutate: updateChequePayments, isPending: isUpdatingPayments } = useMutation({
        mutationFn: ({ buildingId, chequePayments }) => 
            updateBuilding(buildingId, { cheque_payments: chequePayments }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["building"] });
            queryClient.invalidateQueries({ queryKey: ["building-list"] });
            toast.success("Payments updated successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update payments");
        },
    });

    return { 
        addChequePayment, 
        deleteChequePayment, 
        updateChequePayments, 
        isAddingPayment, 
        isDeletingPayment, 
        isUpdatingPayments 
    };
} 