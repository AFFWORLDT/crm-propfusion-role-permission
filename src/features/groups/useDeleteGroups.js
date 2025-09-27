import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteGroup } from "../../services/apiGroups";

function useDeleteGroups() {
    const queryClient = useQueryClient();

    const { mutate: removeGroup, isPending } = useMutation({
        mutationFn: deleteGroup,
        onSuccess: () => {
            toast.success("Group deleted!");
            queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { removeGroup, isPending };
}

export default useDeleteGroups;
