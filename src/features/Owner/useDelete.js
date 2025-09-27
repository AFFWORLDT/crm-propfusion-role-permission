import { useQueryClient,useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteOwner } from "../../services/apiOwner";

const useDeleteOwner = ()=>{
    const queryClient = useQueryClient();
    const {mutate:deleting,isPending}=useMutation({
        mutationFn:deleteOwner,
        onSuccess:()=>{
            queryClient.invalidateQueries(['owners']);
            toast.success('Owner deleted successfully');
            },
            onError:()=>{
                toast.error('Error deleting owner');
                }
    })
    return {deleting,isPending}
}
export default useDeleteOwner