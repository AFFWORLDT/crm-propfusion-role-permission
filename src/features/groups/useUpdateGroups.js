import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateMultipleGroups } from "../../services/apiGroups";

function useUpdateGroups() {
    const queryClient = useQueryClient();

    const { mutate: changeGroups, isPending } = useMutation({
        mutationFn: updateMultipleGroups,
        onSuccess: () => {
            toast.success("Groups updated!");
            queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { changeGroups, isPending };
}

export default useUpdateGroups;
