import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWatchman } from "../../services/apiwatchmen";
import toast from "react-hot-toast";
function useDeleteWatchman() {
    const queryClient = useQueryClient();

    const { mutate: deleteWatchmanMutation, isLoading, error } = useMutation({
        mutationFn: deleteWatchman,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["watchmen"] });
            toast.success("Watchman deleted successfully");
        },
    });

    return {
        deleteWatchman: deleteWatchmanMutation,
        isLoading,
        error
    };
}

export default useDeleteWatchman; 