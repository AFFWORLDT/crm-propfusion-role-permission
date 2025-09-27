import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteFloorPlan } from "../../services/apiNewProjects";

function useDeleteFloorPlan() {
    const queryClient = useQueryClient();

    const { mutate: removeFloorPlan, isPending } = useMutation({
        mutationFn: ({ projectId, floorPlanId }) =>
            deleteFloorPlan(projectId, floorPlanId),
        onSuccess: () => {
            toast.success("Floor plan deleted!");
            queryClient.invalidateQueries({ queryKey: ["project"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { removeFloorPlan, isPending };
}

export default useDeleteFloorPlan;
