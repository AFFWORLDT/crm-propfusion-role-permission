import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWatermarkSettings } from "../../../services/apiWatermark";
import toast from "react-hot-toast";

function useUpdateWatermarkSettings() {
    const queryClient = useQueryClient();

    const { mutate: changeWatermarkSettings, isPending } = useMutation({
        mutationFn: updateWatermarkSettings,
        onSuccess: () => {
            toast.success("Watermark settings updated!");
            queryClient.invalidateQueries({ queryKey: ["watermarkSettings"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { changeWatermarkSettings, isPending };
}

export default useUpdateWatermarkSettings;
