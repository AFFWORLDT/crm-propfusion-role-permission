import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getNewProperties } from "../../services/apiProperties";
import { PAGE_SIZE } from "../../utils/constants";

function useNewProperties(listing_type,) {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();

    const filters = {
        listing_type,
        sort_by_date: searchParams.get("sortType") ?? "DESC",
        status: searchParams.get("status") ?? "ACTIVE",
        page: 1,
    };
    for (const [key, val] of searchParams.entries()) {
        if (key === "page") {
            filters[key] = Number(val) || 1;
            continue;
        }
        if (val) filters[key] = val;
    }

    const { isLoading, data, error } = useQuery({
        queryFn: ({ signal }) => getNewProperties(filters, signal),
        queryKey: ["newProperties", filters],
    });

    // Pre-fetching Data
    const pageCount = Math.ceil(data?.totalProperties / PAGE_SIZE);

    if (filters.page && filters.page < pageCount) {
        const newFilters = { ...filters, page: filters.page + 1 };
        queryClient.prefetchQuery({
            queryFn: ({ signal }) => getNewProperties(newFilters, signal),
            queryKey: ["newProperties", newFilters],
        });
    }

    if (filters.page && filters.page > 1) {
        const newFilters = { ...filters, page: filters.page - 1 };
        queryClient.prefetchQuery({
            queryFn: ({ signal }) => getNewProperties(newFilters, signal),
            queryKey: ["newProperties", newFilters],
        });
    }

    return {
        isLoading,
        data: data?.properties ?? [],
        totalSize: data?.totalProperties ?? 0,
        error,
    };
}

export default useNewProperties;
