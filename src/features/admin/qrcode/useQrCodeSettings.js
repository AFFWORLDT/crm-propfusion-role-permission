import { useQuery } from "@tanstack/react-query";
import { getQrCodeSettings } from "../../../services/apiQrCode";

function useQrCodeSettings() {
    const { isLoading, data, error } = useQuery({
        queryKey: ["qrCodeSettings"],
        queryFn: getQrCodeSettings,
    });

    return { isLoading, data, error };
}

export default useQrCodeSettings; 