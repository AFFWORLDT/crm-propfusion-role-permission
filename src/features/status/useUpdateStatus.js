import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateMultipleStatuses } from "../../services/apiStatus";

function useUpdateStatus() {
    const queryClient = useQueryClient();

    const { mutate: changeStatus, isPending } = useMutation({
        mutationFn: updateMultipleStatuses,
        onSuccess: () => {
            toast.success("Status updated!");
            queryClient.invalidateQueries({ queryKey: ["statuses"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { changeStatus, isPending };
}

export default useUpdateStatus;
