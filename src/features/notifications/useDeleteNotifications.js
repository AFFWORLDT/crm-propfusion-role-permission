import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteMultipleNotifications } from "../../services/apiNotifications";

function useDeleteNotifications() {
    const queryClient = useQueryClient();

    const { mutate: removeNotifications, isPending } = useMutation({
        mutationFn: deleteMultipleNotifications,
        onSuccess: () => {
            toast.success("Notifications deleted!");
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["notificationCount"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { removeNotifications, isPending };
}

export default useDeleteNotifications;
