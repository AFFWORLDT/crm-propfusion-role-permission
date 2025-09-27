import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadStaffDocs } from "../../../services/apiStaff";
import toast from "react-hot-toast";
export default function useUploadDocs() {
    const queryClient = useQueryClient();
    const {
        mutate: addDocs,
        isPending,
        error,
    } = useMutation({
        mutationFn: ({ agentId, docs }) => uploadStaffDocs(agentId, docs),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff"] });
            queryClient.invalidateQueries({ queryKey: ["team"], });

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
