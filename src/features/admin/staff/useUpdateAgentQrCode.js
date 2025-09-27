import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadStaffQRCode } from "../../../services/apiStaff";
import toast from "react-hot-toast";

function useUpdateAgentQrCode() {
    const queryClient = useQueryClient();
    const {
        mutate: updateAgentQrCode,
        isPending,
        error,
    } = useMutation({
        mutationFn: ({ agentId, qrCodeFile }) =>
            uploadStaffQRCode(agentId, qrCodeFile),
        onSuccess: () => {
            toast.success("QR code updated successfully");
            queryClient.invalidateQueries({ queryKey: ["staff"] });
            queryClient.invalidateQueries({ queryKey: ["team"] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return { updateAgentQrCode, isPending, error };
}

export default useUpdateAgentQrCode;
