import { useQuery } from "@tanstack/react-query";
import { getStatus } from "../../services/apiStatus";

function useStatus(statuesType) {
    const { isLoading, data, error } = useQuery({
        queryFn: () => getStatus(statuesType),
        queryKey: ["statuses", statuesType],
    });

    return {
        isLoading,
        data: data ?? [],
        error,
    };
}

export default useStatus;
