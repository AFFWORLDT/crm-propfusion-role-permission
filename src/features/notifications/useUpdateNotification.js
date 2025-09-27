import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateNotification } from "../../services/apiNotifications";

function useUpdateNotification() {
    const queryClient = useQueryClient();

    const { mutate: changeNotification, isPending } = useMutation({
        mutationFn: ({ id, payload }) => updateNotification(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["notificationCount"] });
            queryClient.invalidateQueries({ queryKey: ["notifications-infinite"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { changeNotification, isPending };
}

export default useUpdateNotification;
