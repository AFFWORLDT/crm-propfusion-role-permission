import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteTag } from "../../services/apiTags";

function useDeleteTag() {
    const queryClient = useQueryClient();

    const { mutate: removeTag, isPending } = useMutation({
        mutationFn: deleteTag,
        onSuccess: () => {
            toast.success("Tag deleted!");
            queryClient.invalidateQueries({ queryKey: ["tags"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { removeTag, isPending };
}

export default useDeleteTag;
