import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { uploadOwnerDocs } from "../../services/apiOwner";
export function useOwnerUploadDocs() {
    const queryClient = useQueryClient();

    const {
        mutate: uploadDocs,
        isPending,
        error,
    } = useMutation({
        mutationFn: ({ ownerId, files }) =>
            uploadOwnerDocs(ownerId, files),
        onSuccess: () => {
            // Invalidate and refetch tenant documents
            queryClient.invalidateQueries(["owner"]);
            queryClient.invalidateQueries(["owner-list"]);
            toast.success("Documents uploaded successfully");
        },
        onError: (error) => {
            console.error("Error uploading documents:", error);
            toast.error(error.message || "Failed to upload documents");
        },
    });

    return { uploadDocs, isPending, error };
}
