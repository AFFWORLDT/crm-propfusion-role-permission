import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadDeveloperImage } from "../../../services/apiDevelopers";
import toast from "react-hot-toast";

function useUpdateDeveloperImage() {
    const queryClient = useQueryClient();

    const { mutate: updateDeveloperImage, isPending } = useMutation({
        mutationFn: ({ id, imageFile }) => uploadDeveloperImage(id, imageFile),
        onSuccess: () => {
            toast.success("Developer image updated!");
            queryClient.invalidateQueries({ queryKey: ["developers"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { updateDeveloperImage, isPending };
}

export default useUpdateDeveloperImage;
