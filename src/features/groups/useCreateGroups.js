import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createMultipleGroups } from "../../services/apiGroups";

function useCreateGroups() {
    const queryClient = useQueryClient();

    const { mutate: addGroups, isPending } = useMutation({
        mutationFn: createMultipleGroups,
        onSuccess: () => {
            toast.success("New groups created!");
            queryClient.invalidateQueries({ queryKey: ["groups"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { addGroups, isPending };
}

export default useCreateGroups;
