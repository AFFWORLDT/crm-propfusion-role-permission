import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPropertyFinderKey } from "../../../services/apiIntegrations";
import toast from "react-hot-toast";

function useCreatePropertyFinderKey() {
    const queryClient = useQueryClient();

    const { mutate: savePropertyFinderKey, isPending } = useMutation({
        mutationFn: createPropertyFinderKey,
        onSuccess: () => {
            toast.success("API key saved!");
            queryClient.invalidateQueries({
                queryKey: ["propertyFinderApiKey"],
            });
        },
        onError: (err) => toast.error(err.message),
    });

    return { savePropertyFinderKey, isPending };
}

export default useCreatePropertyFinderKey;
