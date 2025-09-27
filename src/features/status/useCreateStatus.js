import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createMultipleStatus } from "../../services/apiStatus";

function useCreateStatus() {
    const queryClient = useQueryClient();

    const { mutate: addStatus, isPending } = useMutation({
        mutationFn: createMultipleStatus,
        onSuccess: () => {
            toast.success("New statuses created!");
            queryClient.invalidateQueries({ queryKey: ["statuses"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { addStatus, isPending };
}

export default useCreateStatus;
