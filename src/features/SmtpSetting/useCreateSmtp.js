import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CreateSmtp } from "./../../services/apiSmtp";

function useCreateSmtp() {
    const queryClient = useQueryClient();

    const { mutate: addSmtp, isPending } = useMutation({
        mutationFn: CreateSmtp,
        onSuccess: () => {
            toast.success("created Successfully!");
            queryClient.invalidateQueries({ queryKey: ["smtp"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { addSmtp, isPending };
}

export default useCreateSmtp;
