import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteManufacturer } from "../../services/apiManufacturers";

function useDeleteManufacturer() {
    const queryClient = useQueryClient();

    const {
        mutate: deleteManufacturerMutation,
        isPending,
        error,
    } = useMutation({
        mutationFn: (manufacturerId) => {
            return deleteManufacturer(manufacturerId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["infiniteManufacturers"],
            });
            toast.success("Manufacturer deleted!");
        },
    });

    return {
        deleteManufacturer: deleteManufacturerMutation,
        isPending,
        error,
    };
}

export default useDeleteManufacturer; 