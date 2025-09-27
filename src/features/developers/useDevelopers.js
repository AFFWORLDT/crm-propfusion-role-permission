import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDevelopers } from "../../services/apiDevelopers";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";

function useDevelopers(fetchAll = false) {
    const queryClient = useQueryClient();

    const [searchParams] = useSearchParams();
    const filters = {
        name: fetchAll ? null : searchParams.get("name"),
        page: fetchAll ? null : Number(searchParams.get("page")) || 1,
    };

    const { isLoading, data, error } = useQuery({
        queryFn: ({ signal }) => getDevelopers(filters, fetchAll, signal),
        queryKey: ["developers", filters, fetchAll],
    });

    // Pre-fetching Data
    const pageCount = Math.ceil(data?.totalDevelopers / PAGE_SIZE);

    if (filters.page && filters.page < pageCount) {
        const newFilters = { ...filters, page: filters.page + 1 };
        queryClient.prefetchQuery({
            queryFn: ({ signal }) =>
                getDevelopers(newFilters, fetchAll, signal),
            queryKey: ["developers", newFilters, fetchAll],
        });
    }

    if (filters.page && filters.page > 1) {
        const newFilters = { ...filters, page: filters.page - 1 };
        queryClient.prefetchQuery({
            queryFn: ({ signal }) =>
                getDevelopers(newFilters, fetchAll, signal),
            queryKey: ["developers", newFilters, fetchAll],
        });
    }

    return {
        isLoading,
        data: data?.developers ?? [],
        totalSize: data?.totalDevelopers ?? 0,
        error,
    };
}

export default useDevelopers;