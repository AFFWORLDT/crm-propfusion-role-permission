import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDeveloper } from "../../services/apiDevelopers";
import toast from "react-hot-toast";

function useCreateDeveloper() {
    const queryClient = useQueryClient();

    const {
        mutate: addDeveloper,
        isPending,
        error,
    } = useMutation({
        mutationFn: ({ name, logo }) => {
            createDeveloper({ name, logo });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["developers"] });
            toast.success("Developer created!");
        },
    });
    return {
        addDeveloper,
        isPending,
        error,
    };
}

export default useCreateDeveloper;
