import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAreas } from "../../services/apiAreas";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";

function useAreas(fetchAll = false) {
    const queryClient = useQueryClient();

    const [searchParams] = useSearchParams();
    const filters = {
        page: fetchAll ? null : Number(searchParams.get("page")) || 1,
        sort_by_total_count: searchParams.get("sort_by_total_count") || "DESC",
        sort_field: searchParams.get("sort_field") || "total_count"
    };
    for (const [key, val] of searchParams.entries()) {
        if (key === "page") {  
            filters[key] = Number(val) || 1;
            continue;
        }
        if (val) filters[key] = val;
    }

    const { isLoading, data, error } = useQuery({
        queryFn: ({ signal }) => getAreas(filters, fetchAll, signal),
        queryKey: ["areas", filters, fetchAll],
    });

    // Pre-fetching Data
    const pageCount = Math.ceil(data?.totalAreas / PAGE_SIZE);

    if (filters.page && filters.page < pageCount) {
        const newFilters = { ...filters, page: filters.page + 1 };
        queryClient.prefetchQuery({
            queryFn: ({ signal }) => getAreas(newFilters, fetchAll, signal),
            queryKey: ["areas", newFilters, fetchAll],
        });
    }

    if (filters.page && filters.page > 1) {
        const newFilters = { ...filters, page: filters.page - 1 };
        queryClient.prefetchQuery({
            queryFn: ({ signal }) => getAreas(newFilters, fetchAll, signal),
            queryKey: ["areas", newFilters, fetchAll],
        });
    }

    return {
        isLoading,
        data: data?.areas ?? [],
        totalSize: data?.totalAreas ?? 0,
        error,
    };
}

export default useAreas;
