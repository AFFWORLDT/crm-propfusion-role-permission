import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteSmtp } from "./../../services/apiSmtp";

function useDeleteSmtp() {
    const queryClient = useQueryClient();
    
    const { mutate: deleteing, isPending } = useMutation({
        mutationFn: deleteSmtp,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['smtp'] });
            toast.success('SMTP deleted successfully');
        },
        onError: (error) => {
            toast.error('Error deleting SMTP');
            console.error('Delete error:', error);
        }
    });
    return { deleteing, isPending };
}

export default useDeleteSmtp;