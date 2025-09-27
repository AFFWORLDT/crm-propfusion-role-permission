import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateViewing } from "../../services/apiAllViewing";

export const useUpdateViewing = () => {
    const queryClient = useQueryClient();
    const {
        mutate: updateViewingMutation,
        isPending,
        error,
    } = useMutation({
        mutationFn: ({ viewingId, viewingData }) =>
            updateViewing(viewingId, viewingData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["viewingsLists"] });
            toast.success("Viewing updated successfully");
        },
        onError: () => {
            toast.error("Failed to update viewing");
        },
    });
    return {
        updateViewing: updateViewingMutation,
        isPending,
        error,
    };
};

export default useUpdateViewing;
