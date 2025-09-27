import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOwnerDocument } from "../../services/apiOwner";
import { toast } from "react-hot-toast";
export function useDeleteOwnerDocs() {
    const queryClient = useQueryClient();

    const { mutate: deleteDocs, isPending, error } = useMutation({
        mutationFn: ({ ownerId, documentUrl }) => deleteOwnerDocument(ownerId, documentUrl),
        onSuccess: () => {
            queryClient.invalidateQueries(["owner"]);
            queryClient.invalidateQueries(["owner-list"]);
            toast.success("Documents deleted successfully");
        },
        onError: (error) => {
            console.error("Error deleting documents:", error);
        },
    });

    return { deleteDocs, isPending, error };

}   
