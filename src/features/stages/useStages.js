import { useQuery } from "@tanstack/react-query";
import { getStages } from "../../services/apiStages";

function useStages(stageType) {
    const { isLoading, data, error } = useQuery({
        queryFn: () => getStages(stageType),
        queryKey: ["stages", stageType],
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

export default useStages;
