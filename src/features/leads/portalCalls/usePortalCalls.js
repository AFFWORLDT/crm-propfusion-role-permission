import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPortalCalls } from "../../../services/apiLeads";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../../utils/constants";

function usePortalCalls() {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();

    const filters = {
        sortType: "DESC",
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
        queryFn: ({ signal }) => getPortalCalls(filters, signal),
        queryKey: ["portalCalls", filters],
    });

    // Pre-fetching Data
    const pageCount = Math.ceil(data?.count / PAGE_SIZE);

    if (filters.page && filters.page < pageCount) {
        const newFilters = { ...filters, page: filters.page + 1 };
        queryClient.prefetchQuery({
            queryFn: ({ signal }) => getPortalCalls(newFilters, signal),
            queryKey: ["portalCalls", newFilters],
        });
    }

    if (filters.page && filters.page > 1) {
        const newFilters = { ...filters, page: filters.page - 1 };
        queryClient.prefetchQuery({
            queryFn: ({ signal }) => getPortalCalls(newFilters, signal),
            queryKey: ["portalCalls", newFilters],
        });
    }

    return {
        isLoading,
        data: data?.call_trackings ?? [],
        totalSize: data?.count ?? 0,
        error,
    };
}

export default usePortalCalls;
