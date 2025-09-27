import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWatchman } from "../../services/apiwatchmen";
import toast from "react-hot-toast";

function useUpdateWatchman() {
    const queryClient = useQueryClient();

    const { mutate: updateWatchmanMutation, isLoading, error } = useMutation({
        mutationFn: ({ watchmanId, watchmanData, file }) => updateWatchman(watchmanId, watchmanData, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["watchmen"] });
            toast.success("Watchman updated successfully");
        },
        onError: () => {
            toast.error("Failed to update watchman");
        }
    });

    return {
        updateWatchman: updateWatchmanMutation,
        isLoading,
        error
    };
}

export default useUpdateWatchman; 