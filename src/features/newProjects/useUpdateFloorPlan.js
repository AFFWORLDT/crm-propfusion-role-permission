import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateFloorPlan } from "../../services/apiNewProjects";

function useUpdateFloorPlan() {
    const queryClient = useQueryClient();

    const { mutate: changeFloorPlan, isPending ,data} = useMutation({
        mutationFn: ({ projectId, floorPlanId, updatedFloorPlan  }) =>
            updateFloorPlan(projectId, floorPlanId, updatedFloorPlan),
        onSuccess: () => {
            toast.success("Floor plan updated!");
            queryClient.invalidateQueries({ queryKey: ["project"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { changeFloorPlan, isPending ,data};
}

export default useUpdateFloorPlan;
