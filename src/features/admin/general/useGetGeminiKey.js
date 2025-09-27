import { useQuery } from "@tanstack/react-query";
import { getGeminiKey } from "../../../services/apiIntegrations";

function useGetGeminiKey() {
    const { isLoading, data, error } = useQuery({
        queryFn: getGeminiKey,
        queryKey: ["geminiApiKey"],
    });
    return { isLoading, data: data?.apiKey ?? "", error };
}

export default useGetGeminiKey; 