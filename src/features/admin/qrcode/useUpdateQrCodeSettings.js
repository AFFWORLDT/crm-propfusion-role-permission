import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateQrCodeSettings } from "../../../services/apiQrCode";
import toast from "react-hot-toast";

function useUpdateQrCodeSettings() {
    const queryClient = useQueryClient();

    const { mutate: changeQrCodeSettings, isPending } = useMutation({
        mutationFn: updateQrCodeSettings,
        onSuccess: () => {
            toast.success("QR code settings updated successfully");
            queryClient.invalidateQueries({ queryKey: ["qrCodeSettings"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { changeQrCodeSettings, isPending };
}

export default useUpdateQrCodeSettings; 