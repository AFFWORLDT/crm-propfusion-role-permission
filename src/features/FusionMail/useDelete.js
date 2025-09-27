import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteFusionMail } from "../../services/apiFusionMail";

function useDeleteMail() {
    const queryClient = useQueryClient();
    
    const { mutate: deleteing, isPending } = useMutation({
        mutationFn: deleteFusionMail,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fusionmail'] });
            toast.success('Mail deleted successfully');
        },
        onError: (error) => {
            toast.error('Error deleting ');
            console.error('Delete error:', error);
        }
    });

    return { deleteing, isPending };
}

export default useDeleteMail;