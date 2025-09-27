import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteProjectBrochure } from "../../services/apiNewProjects";

export default function useDeleteProjectBrochure() {
    const queryClient = useQueryClient();
    const { mutate: removeProjectBrochure, isPending } = useMutation({
        mutationFn: (projectId) => deleteProjectBrochure(projectId),
        onSuccess: () => {
            toast.success("Brochure deleted!");
            queryClient.invalidateQueries({
                queryKey: ["project"],
            });
        },
        onError: (err) => toast.error(err.message),
    });

    return { removeProjectBrochure, isPending };
}
