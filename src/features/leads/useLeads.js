import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLeads } from "../../services/apiLeads";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";

function useLeads(leadType,propertyId) {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();

    const filters = {
        clientType: leadType,
        sortType: searchParams.get("sortType") ?? "DESC",
        status: searchParams.get("status") ?? "ACTIVE",
        page: 1,
        property_id:propertyId
    };
    for (const [key, val] of searchParams.entries()) {
        if (key === "page") {
            filters[key] = Number(val) || 1;
            continue;
        }
        if (val) filters[key] = val;
    }

    const { isLoading, data, error } = useQuery({
        queryFn: ({ signal }) => getLeads(filters, signal),
        queryKey: ["leads", filters],
    });

    // Pre-fetching Data
    const pageCount = Math.ceil(data?.totalLeads / PAGE_SIZE);

    if (filters.page && filters.page < pageCount) {
        const newFilters = { ...filters, page: filters.page + 1 };
        queryClient.prefetchQuery({
            queryFn: ({ signal }) => getLeads(newFilters, signal),
            queryKey: ["leads", newFilters],
        });
    }

    if (filters.page && filters.page > 1) {
        const newFilters = { ...filters, page: filters.page - 1 };
        queryClient.prefetchQuery({
            queryFn: ({ signal }) => getLeads(newFilters, signal),
            queryKey: ["leads", newFilters],
        });
    }

    return {
        isLoading,
        data: data?.leads ?? [],
        totalSize: data?.totalLeads,
        error,
    };
}

export default useLeads;
