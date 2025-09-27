import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createMultipleRatings } from "../../services/apiRating";

function useCreateRatings() {
    const queryClient = useQueryClient();

    const { mutate: addRatings, isPending } = useMutation({
        mutationFn: createMultipleRatings,
        onSuccess: () => {
            toast.success("New ratings created!");
            queryClient.invalidateQueries({ queryKey: ["ratings"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { addRatings, isPending };
}

export default useCreateRatings;
