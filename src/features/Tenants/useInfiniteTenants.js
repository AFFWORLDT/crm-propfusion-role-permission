import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllTenants } from "../../services/apiTenants";
import { useSearchParams } from "react-router-dom";

function useInfiniteTenants(searchQuery = "", fetchAll = false) {
    const [searchParams] = useSearchParams();
    const filters = {
        tenant_name: searchQuery,
        page: 1,
        size: 12, // Set a fixed page size
    };

    for (const [key, val] of searchParams.entries()) {
        if (key === "page") {
            filters[key] = Number(val) || 1;
            continue;
        }
        if (val) filters[key] = val;
    }

    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["tenents", filters],
        queryFn: ({ pageParam = 1 }) => getAllTenants({ 
            ...filters, 
            page: pageParam,
        }, fetchAll),
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage?.tenants?.length) return undefined;
            const totalPages = Math.ceil(lastPage.total / filters.size);
            const nextPage = allPages.length + 1;
            return nextPage <= totalPages ? nextPage : undefined;
        },
        initialPageParam: 1,
    });

    return {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        tenants: data?.pages.flatMap((page) => page.tenants || []) ?? [],
        totalSize: data?.pages[0]?.total ?? 0,
    };
}

export default useInfiniteTenants; 