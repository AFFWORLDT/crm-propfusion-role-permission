import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateMultipleRatings } from "../../services/apiRating";

function useUpdateRating() {
    const queryClient = useQueryClient();

    const { mutate: changeRating, isPending } = useMutation({
        mutationFn: updateMultipleRatings,
        onSuccess: () => {
            toast.success("Ratings updated!");
            queryClient.invalidateQueries({ queryKey: ["ratings"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { changeRating, isPending };
}

export default useUpdateRating;
