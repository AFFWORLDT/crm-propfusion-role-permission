import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWatchman } from "../../services/apiwatchmen";
import toast from "react-hot-toast";

function useUpdateKycStatus() {
    const queryClient = useQueryClient();

    const { mutate: updateKycStatus, isPending: isUpdatingKyc } = useMutation({
        mutationFn: ({ watchmanId, kycStatus }) =>
            updateWatchman(watchmanId, { kyc_verification: kycStatus }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["watchmen"] });
            queryClient.invalidateQueries({ queryKey: ["watchman"] });
            toast.success("KYC status updated successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update KYC status");
        }
    });

    return { updateKycStatus, isUpdatingKyc };
}

export default useUpdateKycStatus; 