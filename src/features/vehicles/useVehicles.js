import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";
import { getVehicleLists } from "../../services/apiVehicles";

function useVehicles() {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();

    const filters = {
        sortType: searchParams.get("sortType") ?? "DESC",
        status: searchParams.get("status") ?? "ACTIVE",
        page: 1
    };

    for (const [key, val] of searchParams.entries()) {
        if (key === "page") {
            filters[key] = Number(val) || 1;
            continue;
        }
        if (val) filters[key] = val;
    }

    const { isLoading, data, error } = useQuery({
        queryFn: ({ signal }) => getVehicleLists(filters, false, signal),
        queryKey: ["vehicles", filters],
    });

    // Pre-fetching Data
    const pageCount = Math.ceil(data?.totalCount / PAGE_SIZE);

    if (filters.page && filters.page < pageCount) {
        const newFilters = { ...filters, page: filters.page + 1 };
        queryClient.prefetchQuery({
            queryFn: ({ signal }) => getVehicleLists(newFilters, false, signal),
            queryKey: ["vehicles", newFilters],
        });
    }

    if (filters.page && filters.page > 1) {
        const newFilters = { ...filters, page: filters.page - 1 };
        queryClient.prefetchQuery({
            queryFn: ({ signal }) => getVehicleLists(newFilters, false, signal),
            queryKey: ["vehicles", newFilters],
        });
    }

    return {
        isLoading,
        data: data?.vehicles ?? [],
        totalCount: data?.totalCount,
        error,
    };
}

export default useVehicles; 