import { useQuery } from "@tanstack/react-query";
import { getPropertyFinderKeys } from "../../../services/apiIntegrations";

function useGetPropertyFinderKeys() {
    const { isLoading, data, error } = useQuery({
        queryFn: getPropertyFinderKeys,
        queryKey: ["propertyFinderApiKeys"],
    });

    return { isLoading, data: data ?? null, error };
}

export default useGetPropertyFinderKeys;
