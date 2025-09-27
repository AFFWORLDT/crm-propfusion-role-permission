import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteStage } from "../../services/apiStages";

function useDeleteStages() {
    const queryClient = useQueryClient();

    const { mutate: removeStage, isPending } = useMutation({
        mutationFn: deleteStage,
        onSuccess: () => {
            toast.success("Stage deleted!");
            queryClient.invalidateQueries({ queryKey: ["stages"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { removeStage, isPending };
}

export default useDeleteStages;
