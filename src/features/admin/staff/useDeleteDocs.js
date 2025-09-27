import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStaffDocs } from "../../../services/apiStaff";
import toast from "react-hot-toast";

export default function useDeleteDocs() {
    const queryClient = useQueryClient();

    const { mutate: deleteDocs, isPending, error } = useMutation({
        mutationFn: ({ agentId, docUrls }) => deleteStaffDocs(agentId, docUrls),
        onSuccess: () => {
            toast.success("Documents deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["staff"], });
            queryClient.invalidateQueries({ queryKey: ["team"], });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return { deleteDocs, isPending, error };
} 