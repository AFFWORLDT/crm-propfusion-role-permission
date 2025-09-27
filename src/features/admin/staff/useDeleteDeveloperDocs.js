import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDeveloperDocs } from "../../../services/apiDevelopers";

export default function useDeleteDeveloperDocs() {
    const queryClient = useQueryClient();
    const {
        mutate: deleteDocs,
        isPending,
        error,
    } = useMutation({
        mutationFn: ({ developerId, docUrls }) =>
            deleteDeveloperDocs(developerId, docUrls),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["developers"] });
        },
    });
    return { deleteDocs, isPending, error };
}
