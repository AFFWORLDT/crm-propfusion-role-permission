import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProjectMasterPlan } from "../../services/apiNewProjects";
import toast from "react-hot-toast";

export function useDeleteMasterPlans() {
    const queryClient = useQueryClient();
    const {
        isLoading: isDeleting,
        mutate: deleteMasterPlan,
        error,
    } = useMutation({
        mutationFn: ({
            id,
            url
        }) => deleteProjectMasterPlan(id, url),
        onSuccess: () => {
            toast.success("Master plan deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["project"] });
        },
        onError: (err) => {
            toast.error(err.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["project"] });
        },
    });

    return { isDeleting, deleteMasterPlan, isDeletingError: error };
}
