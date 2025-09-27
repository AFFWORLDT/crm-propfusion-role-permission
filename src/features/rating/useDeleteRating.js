import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteRating } from "../../services/apiRating";

function useDeleteTag() {
    const queryClient = useQueryClient();

    const { mutate: removeRating, isPending } = useMutation({
        mutationFn: deleteRating,
        onSuccess: () => {
            toast.success("Rating deleted!");
            queryClient.invalidateQueries({ queryKey: ["ratings"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { removeRating, isPending };
}

export default useDeleteTag;
