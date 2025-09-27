import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateSmtp } from "./../../services/apiSmtp";

function useUpdateSmtp() {
    const queryClient = useQueryClient();

    const { mutate: updatedata, isPendings } = useMutation({
        mutationFn: ({ id, payload }) => updateSmtp(id, payload),
        onSuccess: () => {
            toast.success("Update Successfully!");
            queryClient.invalidateQueries({ queryKey: ["smtp"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { updatedata, isPendings };
}

export default useUpdateSmtp;
