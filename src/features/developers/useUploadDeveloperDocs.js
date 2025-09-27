import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadDeveloperDocs } from "../../services/apiDevelopers";
import toast from "react-hot-toast";

export default function useUploadDeveloperDocs() {
    const queryClient = useQueryClient();
    const {
        mutate: addDocs,
        isPending,
        error,
    } = useMutation({
        mutationFn: ({ developerId, docs }) => uploadDeveloperDocs(developerId, docs),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["developers"] });

            toast.success("Documents uploaded successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return {
        addDocs,
        isPending,
        error,
    };
}
