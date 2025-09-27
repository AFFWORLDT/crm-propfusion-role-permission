import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deletePropertyImage } from "../../services/apiProperties";

function useDeletePropertyImage() {
    const queryClient = useQueryClient();

    const { mutate: removePropertyImage, isPending } = useMutation({
        mutationFn: ({ propertyId, imageUrl }) =>
            deletePropertyImage(propertyId, imageUrl),
        onSuccess: () => {
            toast.success("Property document deleted!");
            queryClient.invalidateQueries({ queryKey: ["newProperty"] });
            queryClient.invalidateQueries({ queryKey: ["newProperties"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { removePropertyImage, isPending };
}

export default useDeletePropertyImage;
