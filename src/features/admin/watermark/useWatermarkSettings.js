import { useQuery } from "@tanstack/react-query";
import { getWatermarkSettings } from "../../../services/apiWatermark";

function useWatermarkSettings() {
    const { isLoading, data, error } = useQuery({
        queryFn: getWatermarkSettings,
        queryKey: ["watermarkSettings"],
    });

    return { isLoading, data, error };
}

export default useWatermarkSettings;
