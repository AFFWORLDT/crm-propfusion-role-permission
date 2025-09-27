import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteAudience } from "../../services/apiAudience";

function useDeleteAudience() {
    const queryClient = useQueryClient();
    
    const { mutate: deleteing, isPending } = useMutation({
        mutationFn: deleteAudience,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['audience'] });
            toast.success('Audience deleted successfully');
        },
        onError: (error) => {
            toast.error('Error deleting SMTP');
            console.error('Delete error:', error);
        }
    });

    return { deleteing, isPending };
}

export default useDeleteAudience;