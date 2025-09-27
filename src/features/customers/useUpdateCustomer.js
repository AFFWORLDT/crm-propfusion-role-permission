import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCustomer } from "../../services/apiCustomer";
import { toast } from "react-hot-toast";

function useUpdateCustomer() {
    const queryClient = useQueryClient();

    const { isLoading: isUpdating, mutate: update } = useMutation({
        mutationFn: ({ id, customerData }) => updateCustomer(id, customerData),
        onSuccess: () => {
            toast.success("Customer successfully updated");
            queryClient.invalidateQueries({ queryKey: ["customers"] });
        },
        onError: (err) => {
            toast.error(err.message || "Failed to update customer");
        },
    });

    return { isUpdating, update };
}

export default useUpdateCustomer; 