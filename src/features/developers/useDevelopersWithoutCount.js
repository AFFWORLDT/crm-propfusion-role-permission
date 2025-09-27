import { useQuery } from "@tanstack/react-query";
import { getDevelopersWithoutCount } from "../../services/apiDevelopers";

function useDevelopersWithoutCount(fetchAll = false) {
    const { isLoading, data, error } = useQuery({
        queryFn: ({ signal }) => getDevelopersWithoutCount(fetchAll, signal),
        queryKey: ["developersWithoutCount", fetchAll],
    });

    return {
        isLoading,
        data: data?.developers ?? [],
        totalSize: data?.totalDevelopers ?? 0,
        error,
    };
}

export default useDevelopersWithoutCount;
