import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRentalAgreement } from "../../services/apiRentalAgreeMent";
import toast from "react-hot-toast";
import { useDeleteImage } from "../Extra/useDeleteImage";

export function useChequePayments() {
    const queryClient = useQueryClient();
    const { deleteImage } = useDeleteImage();

    const { mutate: addChequePayment, isPending: isAddingPayment } = useMutation({
        mutationFn: ({ rentalAgreementId, chequePayments }) => 
            updateRentalAgreement(rentalAgreementId, { cheque_payments: chequePayments }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rental-agreement"] });
            queryClient.invalidateQueries({ queryKey: ["rental-agreement-list"] });
            toast.success("Payment added successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to add payment");
        },
    });

    const { mutate: deleteChequePayment, isPending: isDeletingPayment } = useMutation({
        mutationFn: ({ rentalAgreementId, chequePayments }) => 
            updateRentalAgreement(rentalAgreementId, { cheque_payments: chequePayments }),
        onSuccess: (data,variables) => {
            queryClient.invalidateQueries({ queryKey: ["rental-agreement"] });
            queryClient.invalidateQueries({ queryKey: ["rental-agreement-list"] });
            toast.success("Payment deleted successfully");
            console.log(variables);
            
            deleteImage(variables.chequePayments.receipt_image);
            
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete payment");
        },
    });

    const { mutate: updateChequePayments, isPending: isUpdatingPayments } = useMutation({
        mutationFn: ({ rentalAgreementId, chequePayments }) => 
            updateRentalAgreement(rentalAgreementId, { cheque_payments: chequePayments }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rental-agreement"] });
            queryClient.invalidateQueries({ queryKey: ["rental-agreement-list"] });
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