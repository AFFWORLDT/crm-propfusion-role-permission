import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateFusionMail } from "../../services/apiFusionMail";

function useUpdateFusionMail() {
    const queryClient = useQueryClient();

    const { mutate: updatedata, isPendings } = useMutation({
        mutationFn: ({ id, payload }) => updateFusionMail(id, payload),
        onSuccess: () => {
            toast.success("Update Successfully!");
            queryClient.invalidateQueries({ queryKey: ["fusionmail"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { updatedata, isPendings };
}

export default useUpdateFusionMail;
