import { useQuery } from "@tanstack/react-query";
import { getCloudinaryCredentials } from "../../../services/apiIntegrations";

function useGetCloudinaryCredentials() {
    const { isLoading, data, error } = useQuery({
        queryFn: getCloudinaryCredentials,
        queryKey: ["cloudinaryApiKey"],
    });

    return { isLoading, data: data ?? null, error };
}

export default useGetCloudinaryCredentials; 