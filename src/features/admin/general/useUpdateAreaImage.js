import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadAreaImage } from "../../../services/apiAreas";
import toast from "react-hot-toast";

function useUpdateAreaImage() {
    const queryClient = useQueryClient();

    const { mutate: updateAreaImage, isPending } = useMutation({
        mutationFn: ({ id, imageFile }) => uploadAreaImage(id, imageFile),
        onSuccess: () => {
            toast.success("Area image updated!");
            queryClient.invalidateQueries({ queryKey: ["areas"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { updateAreaImage, isPending };
}

export default useUpdateAreaImage;
