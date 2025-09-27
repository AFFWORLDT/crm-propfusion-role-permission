import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteBlog } from "../../services/apiBlog"; 
function useDeleteBlog() {
    const queryClient = useQueryClient();
    
    const { mutate: deleteing, isPending } = useMutation({
        mutationFn: deleteBlog,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blog'] });
            toast.success('Blog deleted successfully');
        },
        onError: (error) => {
            toast.error('Error deleting Blog');
            console.error('Delete error:', error);
        }
    });
    return { deleteing, isPending };
}

export default useDeleteBlog;