import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CreateFusionMail } from "../../services/apiFusionMail";

function useCreateFusionMail () {
    const queryClient = useQueryClient();

    const { mutate: addMail, isPending } = useMutation({
        mutationFn: CreateFusionMail,
        onSuccess: () => {
            toast.success("created Successfully!");
            queryClient.invalidateQueries({ queryKey: ["fusionmail"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { addMail, isPending };
}

export default useCreateFusionMail;