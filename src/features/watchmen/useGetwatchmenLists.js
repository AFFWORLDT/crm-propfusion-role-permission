import { useQuery } from "@tanstack/react-query";
import { getWatchMenLists } from "../../services/apiwatchmen";
import { useSearchParams } from "react-router-dom";
function useWatchmenLists(fetchAll = false) {
    const [searchParams] = useSearchParams();
    const filters = {
    };

    for (const [key, val] of searchParams.entries()) {
        if (val) filters[key] = val;
    }
    const { data, isLoading, error } = useQuery({
        queryKey: ["watchmen", filters, fetchAll],
        queryFn: () => getWatchMenLists(filters, fetchAll),
    });

    return {
        watchmen: data ?? [],
        isLoading,
        error
    };
}

export default useWatchmenLists;