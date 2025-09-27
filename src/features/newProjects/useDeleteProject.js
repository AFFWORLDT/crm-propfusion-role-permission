import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteProject } from "../../services/apiNewProjects";

function useDeleteProject() {
    const queryClient = useQueryClient();

    const { mutate: removeProject, isPending } = useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            toast.success("Project deleted!");
            queryClient.invalidateQueries({ queryKey: ["project"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { removeProject, isPending };
}

export default useDeleteProject;
