import { useQuery } from "@tanstack/react-query";
import { getAreasWithoutCount } from "../../services/apiAreas";

function useAreasWithoutCount(fetchAll = false) {
    const { isLoading, data, error } = useQuery({
        queryFn: ({ signal }) => getAreasWithoutCount(fetchAll, signal),
        queryKey: ["areasWithoutCount", fetchAll],
    });

    return {
        isLoading,
        data: data?.areas ?? [],
        totalSize: data?.totalAreas ?? 0,
        error,
    };
}

export default useAreasWithoutCount;
