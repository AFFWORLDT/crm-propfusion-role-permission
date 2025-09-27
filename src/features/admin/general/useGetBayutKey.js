import { useQuery } from "@tanstack/react-query";
import { getBayutKey } from "../../../services/apiIntegrations";

function useGetBayutKey() {
    const { isLoading, data, error } = useQuery({
        queryFn: getBayutKey,
        queryKey: ["bayutApiKey"],
    });

    return { isLoading, data: data?.apiKey ?? "", error };
}

export default useGetBayutKey;
