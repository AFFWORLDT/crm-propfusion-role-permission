import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateManufacturer } from "../../services/apiManufacturers";

function useUpdateManufacturer() {
    const queryClient = useQueryClient();

    const {
        mutate: updateManufacturerMutation,
        isPending,
        error,
    } = useMutation({
        mutationFn: ({ manufacturerId, manufacturerData, logoFile }) => {
            return updateManufacturer(manufacturerId, manufacturerData, logoFile);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["infiniteManufacturers"],
            });
            toast.success("Manufacturer updated!");
        },
    });

    return {
        updateManufacturer: updateManufacturerMutation,
        isPending,
        error,
    };
}

export default useUpdateManufacturer; 