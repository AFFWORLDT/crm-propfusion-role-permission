import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBayutKey } from "../../../services/apiIntegrations";
import toast from "react-hot-toast";

function useCreateBayutKey() {
    const queryClient = useQueryClient();

    const { mutate: saveBayutKey, isPending } = useMutation({
        mutationFn: createBayutKey,
        onSuccess: () => {
            toast.success("API key saved!");
            queryClient.invalidateQueries({
                queryKey: ["bayutApiKey"],
            });
        },
        onError: (err) => toast.error(err.message),
    });

    return { saveBayutKey, isPending };
}

export default useCreateBayutKey;
