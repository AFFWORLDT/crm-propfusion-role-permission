import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProject } from "../../services/apiCustomer";
import { toast } from "react-hot-toast";

function useDeleteProject() {
    const queryClient = useQueryClient();

    const { isLoading: isDeleting, mutate: deleteProjectMutation } =
        useMutation({
            mutationFn: (projectName) => deleteProject(projectName),
            onSuccess: () => {
                toast.success("Project successfully deleted");
                queryClient.invalidateQueries({ queryKey: ["projects"] });
                queryClient.invalidateQueries({ queryKey: ["customers"] });
                queryClient.invalidateQueries({ queryKey: ["databases"] });
            },
            onError: (err) => {
                toast.error(err.message || "Failed to delete project");
            },
        });

    return { isDeleting, deleteProjectMutation };
}

export default useDeleteProject;
