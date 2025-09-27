import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteStatus } from "../../services/apiStatus";

function useDeleteStatus() {
    const queryClient = useQueryClient();

    const { mutate: removeStatus, isPending } = useMutation({
        mutationFn: deleteStatus,
        onSuccess: () => {
            toast.success("Status deleted!");
            queryClient.invalidateQueries({ queryKey: ["statuses"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { removeStatus, isPending };
}

export default useDeleteStatus;
