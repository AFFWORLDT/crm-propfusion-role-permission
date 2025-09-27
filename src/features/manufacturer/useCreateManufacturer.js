import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createManufacturer } from "../../services/apiManufacturers";

function useCreateManufacturer() {
    const queryClient = useQueryClient();

    const {
        mutate: addManufacturer,
        isPending,
        error,
    } = useMutation({
        mutationFn: ({ data, logo }) => {
            createManufacturer(data, logo);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["infiniteManufacturers"],
            });
            toast.success("Manufacturer created!");
        },
        onError: (error) => {
            toast.error(error.message);
            queryClient.invalidateQueries({
                queryKey: ["infiniteManufacturers"],
            });
        },
    });
    return {
        addManufacturer,
        isPending,
        error,
    };
}

export default useCreateManufacturer;
