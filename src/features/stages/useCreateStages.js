import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createMultipleStages } from "../../services/apiStages";

function useCreateStages() {
    const queryClient = useQueryClient();

    const { mutate: addStages, isPending } = useMutation({
        mutationFn: createMultipleStages,
        onSuccess: () => {
            toast.success("New stages created!");
            queryClient.invalidateQueries({ queryKey: ["stages"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { addStages, isPending };
}

export default useCreateStages;
