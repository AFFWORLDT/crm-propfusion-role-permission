import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateMultipleTags } from "../../services/apiTags";

function useUpdateTags() {
    const queryClient = useQueryClient();

    const { mutate: changeTags, isPending } = useMutation({
        mutationFn: updateMultipleTags,
        onSuccess: () => {
            toast.success("Tags updated!");
            queryClient.invalidateQueries({ queryKey: ["tags"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { changeTags, isPending };
}

export default useUpdateTags;
