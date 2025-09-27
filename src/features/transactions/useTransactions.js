import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    getTransactions, 
    getTransactionById, 
    createTransaction, 
    updateTransaction, 
    deleteTransaction, 
    approveTransaction,
    uploadTransactionDocument
} from "../../services/apiTransactions";
import { toast } from "react-hot-toast";

// Hook for fetching transactions with filters
export function useTransactions(filters = {}) {
    return useQuery({
        queryKey: ["transactions", filters],
        queryFn: () => getTransactions(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

// Hook for fetching a single transaction
export function useTransaction(transactionId) {
    return useQuery({
        queryKey: ["transaction", transactionId],
        queryFn: () => getTransactionById(transactionId),
        enabled: !!transactionId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

// Hook for creating a transaction
export function useCreateTransaction() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: createTransaction,
        onSuccess: (data) => {
            toast.success("Transaction created successfully!");
            queryClient.invalidateQueries(["transactions"]);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create transaction");
        },
    });
}

// Hook for updating a transaction
export function useUpdateTransaction() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ transactionId, transactionData }) => 
            updateTransaction(transactionId, transactionData),
        onSuccess: (data) => {
            toast.success("Transaction updated successfully!");
            queryClient.invalidateQueries(["transactions"]);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update transaction");
        },
    });
}

// Hook for deleting a transaction
export function useDeleteTransaction() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: deleteTransaction,
        onSuccess: (data) => {
            toast.success("Transaction deleted successfully!");
            queryClient.invalidateQueries(["transactions"]);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete transaction");
        },
    });
}

// Hook for approving a transaction
export function useApproveTransaction() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: approveTransaction,
        onSuccess: (data) => {
            toast.success("Transaction approved successfully!");
            queryClient.invalidateQueries(["transactions"]);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to approve transaction");
        },
    });
}

// Hook for uploading transaction documents
export function useUploadTransactionDocument() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ transactionId, party, file }) => 
            uploadTransactionDocument(transactionId, party, file),
        onSuccess: (data) => {
            toast.success("Document uploaded successfully!");
            queryClient.invalidateQueries(["transactions"]);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to upload document");
        },
    });
}
