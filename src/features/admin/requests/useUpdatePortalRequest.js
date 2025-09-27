import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updatePortalRequest } from "../../../services/apiRequests";

export function useUpdatePortalRequest() {
    const queryClient = useQueryClient();
    const {
        mutate: updateRequest,
        isPending,
        error,
    } = useMutation({
        mutationFn: ({ id, action }) => updatePortalRequest(id, action),
        onSuccess: () => {
            toast.success("Request updated!");
            queryClient.invalidateQueries({ queryKey: ["portal-requests"] });
            queryClient.invalidateQueries({
                queryKey: ["infinite-portal-requests"],
            });
        },
        onError: (err) => toast.error(err.message),
    });

    return { updateRequest, isPending, error };
}
