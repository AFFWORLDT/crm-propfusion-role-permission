import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteProjectImage } from "../../services/apiNewProjects";

function useDeleteProjectImage() {
    const queryClient = useQueryClient();

    const { mutate: removeProjectImage, isPending } = useMutation({
        mutationFn: ({ projectId, imageUrl }) =>
            deleteProjectImage(projectId, imageUrl),
        onSuccess: () => {
            toast.success("Project document deleted!");
            queryClient.invalidateQueries({ queryKey: ["project"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { removeProjectImage, isPending };
}

export default useDeleteProjectImage;
