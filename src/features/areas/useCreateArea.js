import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createArea } from "../../services/apiAreas";

function useCreateArea() {
    const queryClient = useQueryClient();

    const {
        mutate: addArea,
        isPending,
        error,
    } = useMutation({
        mutationFn: ({ name, logo }) => {
            createArea({ name, logo });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["areas"] });
            queryClient.invalidateQueries({ queryKey: ["areasWithoutCount"] });
            toast.success("Area created!");
        },
    });
    return {
        addArea,
        isPending,
        error,
    };
}

export default useCreateArea;
