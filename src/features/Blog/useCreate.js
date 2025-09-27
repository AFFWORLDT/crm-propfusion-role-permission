import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CreateBlog } from "../../services/apiBlog";

const useCreateBlog = () => {
    const queryClient = useQueryClient();
    const { mutate: addBlog, isLoading: isPending } = useMutation({
        mutationFn: CreateBlog,
        onSuccess: () => {
            toast.success("Created Successfully!");
            queryClient.invalidateQueries({ queryKey: ["blog"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { addBlog, isPending };
};

export default useCreateBlog;
