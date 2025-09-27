import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomer } from "../../services/apiCustomer";
import { toast } from "react-hot-toast";

function useCreateCustomer() {
    const queryClient = useQueryClient();

    const { isLoading: isCreating, mutate: create } = useMutation({
        mutationFn: (customerData) => createCustomer(customerData),
        onSuccess: () => {
            toast.success("Customer successfully created");
            queryClient.invalidateQueries({ queryKey: ["customers"] });
        },
        onError: (err) => {
            toast.error(err.message || "Failed to create customer");
        },
    });

    return { isCreating, create };
}

export default useCreateCustomer; 