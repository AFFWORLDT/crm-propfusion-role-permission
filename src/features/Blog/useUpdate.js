import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateBlogApi } from "../../services/apiBlog";
function useUpdateBlog() {
    const queryClient = useQueryClient();

    const { mutate: updateBlog, isPending} = useMutation({
        mutationFn: ({ blogId, queryParams }) => updateBlogApi(blogId, queryParams),
        onSuccess: () => {
            toast.success("Blog updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["blog"] }); 
        },
        onError: (err) => {
            toast.error(`Failed to update blog: ${err.message}`);
        },
    });

    return { updateBlog, isPending };
}

export default useUpdateBlog;