import { useInfiniteQuery } from "@tanstack/react-query";
import { getAreas } from "../../services/apiAreas";
import { useSearchParams } from "react-router-dom";

function useInfiniteAreas(fetchAll=false) {
    const [searchParams] = useSearchParams();
    const filters = {
        // sort_by: searchParams.get("sort_by_total_count") || "DESC",
        // sort_field: searchParams.get("sort_field") || "total_count"
        sort_by: searchParams.get("sort_by") || "total_count",
        sort_order: searchParams.get("sort_order") || "desc"

    };

    // Add any additional filters from search params
    for (const [key, val] of searchParams.entries()) {
        if (val) filters[key] = val;
    }

    const PAGE_SIZE = 24; // Define page size as a constant

    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["infiniteAreas", filters],
        queryFn: ({ pageParam = 1, signal }) => 
            getAreas({ 
                ...filters, 
                page: pageParam,
                size: fetchAll ? 10000 : PAGE_SIZE
            }, fetchAll, signal),

        getNextPageParam: (lastPage, allPages) => {
            // If no areas in last page, we've reached the end
            if (!lastPage.areas.length) return undefined;
            
            // Calculate the total number of items fetched so far
            const totalFetched = allPages.reduce((sum, page) => sum + page.areas.length, 0);
            
            // If we've fetched all items or more, stop
            if (totalFetched >= lastPage.totalAreas) return undefined;
            
            // Calculate the next page number
            const nextPage = Math.floor(totalFetched / PAGE_SIZE) + 1;
            
            // Verify we're not requesting a page we already have
            if (nextPage <= allPages.length) return undefined;
            
            return nextPage;
        },
        initialPageParam: 1,
    });

    // Deduplicate areas based on ID
    const uniqueAreas = data?.pages
        .flatMap((page) => page.areas)
        .reduce((acc, current) => {
            if (!acc.some(item => item.id === current.id)) {
                acc.push(current);
            }
            return acc;
        }, []) ?? [];

    return {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        areas: uniqueAreas,
        totalSize: data?.pages[0]?.totalAreas ?? 0,
    };
}

export default useInfiniteAreas; 