import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCustomer } from "../../services/apiCustomer";
import { toast } from "react-hot-toast";

function useDeleteCustomer() {
    const queryClient = useQueryClient();

    const { isPending: isDeleting, mutate: deleteCustomerFn } = useMutation({
        mutationFn: (customerId) => deleteCustomer(customerId),
        onSuccess: () => {
            toast.success("Customer successfully deleted");
            queryClient.invalidateQueries({ queryKey: ["customers"] });
        },
        onError: (err) => {
            toast.error(err.message || "Failed to delete customer");
        },
    });

    return { isDeleting, deleteCustomer: deleteCustomerFn };
}

export default useDeleteCustomer; 