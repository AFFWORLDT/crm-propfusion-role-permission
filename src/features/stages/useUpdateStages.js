import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateMultipleStages } from "../../services/apiStages";

function useUpdateStages() {
    const queryClient = useQueryClient();

    const { mutate: changeStages, isPending } = useMutation({
        mutationFn: updateMultipleStages,
        onSuccess: () => {
            toast.success("Stages updated!");
            queryClient.invalidateQueries({ queryKey: ["stages"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { changeStages, isPending };
}

export default useUpdateStages;
