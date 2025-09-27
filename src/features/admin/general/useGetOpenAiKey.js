import { useQuery } from "@tanstack/react-query";
import { getOpenAiKey } from "../../../services/apiIntegrations";

function useGetOpenAiKey() {
    const { isLoading, data, error } = useQuery({
        queryFn: getOpenAiKey,
        queryKey: ["openaiApiKey"],
    });
    return { isLoading, data: data?.apiKey ?? "", error };
}

export default useGetOpenAiKey; 