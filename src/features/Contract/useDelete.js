import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deletecontract } from "../../services/apiContract"; 
function useDeleteContract() {
    const queryClient = useQueryClient();
    
    const { mutate: deleteing, isPending } = useMutation({
        mutationFn: deletecontract,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agreements'] });
            toast.success('Contract deleted successfully');
        },
        onError: (error) => {
            toast.error('Error deleting Contract');
            console.error('Delete error:', error);
        }
    });
    return { deleteing, isPending };
}

export default useDeleteContract;