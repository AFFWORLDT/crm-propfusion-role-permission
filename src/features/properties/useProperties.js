    import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getProperties } from "../../services/apiProperties";
import { PAGE_SIZE } from "../../utils/constants";

function useProperties(listingType) {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();

    const filters = {
        listingType,
        sort: "CREATE_TIME",
        sortType: searchParams.get("sortType") ?? "DESC",
        status: searchParams.get("status") ?? "ACTIVE",
        page: 1,
        size: Number(searchParams.get("size")) || PAGE_SIZE,
    };
    for (const [key, val] of searchParams.entries()) {
        if (key === "page") {  
            filters[key] = Number(val) || 1;
            continue;
        }
        if (val) filters[key] = val;
    }

    const { isLoading, data, error } = useQuery({
        queryFn: ({ signal }) => getProperties(filters, signal),
        queryKey: ["properties", filters],
    });

    // Pre-fetching Data
    const pageCount = Math.ceil(data?.totalListings / PAGE_SIZE);

    if (filters.page && filters.page < pageCount) {
        const newFilters = { ...filters, page: filters.page + 1 };
        queryClient.prefetchQuery({
            queryFn: ({ signal }) => getProperties(newFilters, signal),
            queryKey: ["properties", newFilters],
        });
    }

    if (filters.page && filters.page > 1) {
        const newFilters = { ...filters, page: filters.page - 1 };
        queryClient.prefetchQuery({
            queryFn: ({ signal }) => getProperties(newFilters, signal),
            queryKey: ["properties", newFilters],
        });
    }

    return {
        isLoading,
        data: data?.list ?? [],
        totalSize: data?.totalListings ?? 0,
        error,
    };
}

export default useProperties;
