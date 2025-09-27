import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createFloorPlan } from "../../services/apiNewProjects";

function useCreateFloorPlan() {
    const queryClient = useQueryClient();

    const { mutate: addFloorPlan, isPending } = useMutation({
        mutationFn: ({ projectId, newFloorPlan }) =>
            createFloorPlan(projectId, newFloorPlan),
        onSuccess: () => {
            toast.success("New floor plan created!");
            queryClient.invalidateQueries({ queryKey: ["project"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { addFloorPlan, isPending };
}

export default useCreateFloorPlan;
