import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteProperty } from "../../services/apiProperties";

function useDeleteProperty() {
    const queryClient = useQueryClient();

    const { mutate: removeProperty, isPending } = useMutation({
        mutationFn: deleteProperty,
        onSuccess: () => {
            toast.success("Property deleted!");
            queryClient.invalidateQueries({ queryKey: ["newProperties"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { removeProperty, isPending };
}

export default useDeleteProperty;
