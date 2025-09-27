import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createMultipleTags } from "../../services/apiTags";

function useCreateTags() {
    const queryClient = useQueryClient();

    const { mutate: addTags, isPending } = useMutation({
        mutationFn: createMultipleTags,
        onSuccess: () => {
            toast.success("New tags created!");
            queryClient.invalidateQueries({ queryKey: ["tags"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { addTags, isPending };
}

export default useCreateTags;
