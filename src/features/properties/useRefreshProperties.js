import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { postRefreshListing } from "../../services/apiProperties";
import { useParams } from "react-router-dom";

export function useRefreshProperties() {
    const { propertyId } = useParams();
    const { mutate, isPending, error } = useMutation({
        mutationFn: ({ portal }) => {
            postRefreshListing(propertyId, portal);
        },
        onSuccess: () => {
            toast.success("Properties Refreshed!");
        },
        onError: (err) => toast.error(err.message),
    });

    return { mutate, isPending, error };
}
