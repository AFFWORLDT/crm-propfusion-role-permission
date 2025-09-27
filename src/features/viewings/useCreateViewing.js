import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createViewing } from "../../services/apiAllViewing";

export const useCreateViewing = () => {
    const queryClient = useQueryClient();
    const {
        mutate: addViewing,
        isPending,
        error,
    } = useMutation({
        mutationFn: (data) => createViewing(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["viewingsLists"] });
            toast.success("Viewing created successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return {
        addViewing,
        isPending,
        error,
    };
};

export default useCreateViewing;
