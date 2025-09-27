import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCloudinaryKey } from "../../../services/apiIntegrations";
import toast from "react-hot-toast";

function useCreateCloudinaryCred() {
    const queryClient = useQueryClient();

    const { mutate: saveCloudinaryKey, isPending } = useMutation({
        mutationFn: createCloudinaryKey,
        onSuccess: () => {
            toast.success("API key saved!");
            queryClient.invalidateQueries({
                queryKey: ["cloudinaryApiKey"],
            });
        },
        onError: (err) => toast.error(err.message),
    });

    return { saveCloudinaryKey, isPending };
}

export default useCreateCloudinaryCred;
