import { useMutation, useQueryClient } from "@tanstack/react-query";
    import { updateRentalAgreement } from "../../services/apiRentalAgreeMent";
import toast from "react-hot-toast";

export function useUpdateRentalAgreement() {
    const queryClient = useQueryClient();

    const { mutate: updateStatus, isPending } = useMutation({
        mutationFn: ({ id, payload }) => updateRentalAgreement(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rental-agreement"] });
            queryClient.invalidateQueries({ queryKey: ["rental-agreement-list"] });
            toast.success("Status updated successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return { updateStatus, isPending };
} 