import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWatchman } from "../../services/apiwatchmen";
import toast from "react-hot-toast";
function useCreateWatchman() {
    const queryClient = useQueryClient();

    const { mutate: createWatchmanMutation, isLoading, error } = useMutation({
        mutationFn: ({ watchmanData, file }) => createWatchman(watchmanData, file),
        onSuccess: () => {
            console.log("Watchman created successfully");
            queryClient.invalidateQueries({ queryKey: ["watchmen"] });
            toast.success("Watchman created successfully");
        },
    });

    return {
        createWatchman: createWatchmanMutation,
        isLoading,
        error
    };
}

export default useCreateWatchman; 