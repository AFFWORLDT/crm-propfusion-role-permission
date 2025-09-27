import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWatchmanDocument } from "../../services/apiwatchmen";
import { toast } from "react-hot-toast";

export function useDeleteWatchmanDocument() {
    const queryClient = useQueryClient();

    const { mutate: deleteDocument, isPending } = useMutation({
        mutationFn: ({ watchmanId, documentUrl }) => deleteWatchmanDocument(watchmanId, documentUrl),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["watchman"] });
            queryClient.invalidateQueries({ queryKey: ["watchmen"] });
            toast.success("Document deleted successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return { deleteDocument, isPending };
} 