import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRentalAgreement } from "../../services/apiRentalAgreeMent";
import toast from "react-hot-toast";
const useCreateRentalAgreement = () => {
    const queryClient = useQueryClient();
    const { mutate: addRentalAgreement, isPending, error } = useMutation({
        mutationFn: (payload) => createRentalAgreement(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rental-agreement-list"] });
            queryClient.invalidateQueries({ queryKey: ["rental-agreement"] });
            queryClient.invalidateQueries({ queryKey: ["tenant"] });
            toast.success("Rental agreement created successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return { addRentalAgreement, isLoading: isPending, error };
};

export default useCreateRentalAgreement;
