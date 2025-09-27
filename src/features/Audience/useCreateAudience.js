import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CreateAudience ,CreateAudienceprivate} from "../../services/apiAudience";

function useCreateAudience() {
    const queryClient = useQueryClient();

    const { mutate: addAudience, isPending } = useMutation({
        mutationFn: CreateAudience,
        onSuccess: () => {
            toast.success("created Successfully!");
            queryClient.invalidateQueries({ queryKey: ["audience"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { addAudience, isPending };
}

export default useCreateAudience;

function useCreateAudienceprivate() {
    const queryClient = useQueryClient();

    const { mutate: addAudiencep, isPending } = useMutation({
        mutationFn: CreateAudienceprivate,
        onSuccess: () => {
            toast.success("created Successfully!");
            queryClient.invalidateQueries({ queryKey: ["audience"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { addAudiencep, isPending };
}

export {useCreateAudienceprivate}

