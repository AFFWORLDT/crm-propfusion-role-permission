import { useQuery } from "@tanstack/react-query";
import { getWatchman } from "../../services/apiwatchmen";
import { useParams } from "react-router-dom";

/**
 * Hook to fetch watchman data by ID
 * @param {string} watchmanId - The ID of the watchman to fetch
 * @param {Object} options - Additional options for the query
 * @returns {Object} - Destructured query result with data and status
 */
export function useGetWatchmenById() {
    const { watchmanId } = useParams();
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
        isPaused,
        isSuccess,
        ...rest
    } = useQuery({
        queryKey: ["watchman", watchmanId],
        queryFn: () => getWatchman(watchmanId),
        enabled: !!watchmanId,
    });

    return {
        watchman: data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
        isPaused,
        isSuccess,
        ...rest
    };
}
