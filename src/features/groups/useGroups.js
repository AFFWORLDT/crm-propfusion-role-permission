import { useQuery } from "@tanstack/react-query";
import { getGroups } from "../../services/apiGroups";

function useGroups(groupType) {
    const { isLoading, data, error } = useQuery({
        queryFn: () => getGroups(groupType),
        queryKey: ["groups", groupType],
        staleTime: 120000, // 2 minutes
        cacheTime: 120000, // 2 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    return {
        isLoading,
        data: data ?? [],
        error,
    };
}

export default useGroups;
