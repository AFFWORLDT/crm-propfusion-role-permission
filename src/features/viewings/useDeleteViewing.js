import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteViewing } from "../../services/apiAllViewing";

export const useDeleteViewing = () => {
    const queryClient = useQueryClient();
    const {
        mutate: deleteViewingMutation,
        isPending,
        error,
    } = useMutation({
        mutationFn: (viewingId) => deleteViewing(viewingId),
        onSuccess: (res) => {
            console.log(res);
            queryClient.invalidateQueries({ queryKey: ["viewingsLists"] });
            toast.success("Viewing deleted successfully");
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });
    return {
        deleteViewing: deleteViewingMutation,
        isPending,
        error,
    };
};

export default useDeleteViewing;
