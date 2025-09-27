import { useInfiniteQuery } from "@tanstack/react-query";
import { getDevelopers } from "../../services/apiDevelopers";
import { useSearchParams } from "react-router-dom";

function useInfiniteDevelopers() {
    const [searchParams] = useSearchParams();
    const filters = {
        sort_by_total_count: searchParams.get("sort_by_total_count") || "DESC",
        sort_field: searchParams.get("sort_field") || "total_count"
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
        queryKey: ["infiniteDevelopers", filters],
        queryFn: ({ pageParam = 1 }) => 
            getDevelopers({ 
                ...filters, 
                page: pageParam,
                size: PAGE_SIZE
            }, false),

        getNextPageParam: (lastPage, allPages) => {
            // If no developers in last page, we've reached the end
            if (!lastPage.developers.length) return undefined;
            
            // Calculate the total number of items fetched so far
            const totalFetched = allPages.reduce((sum, page) => sum + page.developers.length, 0);
            
            // If we've fetched all items or more, stop
            if (totalFetched >= lastPage.totalDevelopers) return undefined;
            
            // Calculate the next page number
            const nextPage = Math.floor(totalFetched / PAGE_SIZE) + 1;
            
            // Verify we're not requesting a page we already have
            if (nextPage <= allPages.length) return undefined;
            
            return nextPage;
        },
        initialPageParam: 1,
    });

    // Deduplicate developers based on ID
    const uniqueDevelopers = data?.pages
        .flatMap((page) => page.developers)
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
        developers: uniqueDevelopers,
        totalSize: data?.pages[0]?.totalDevelopers ?? 0,
    };
}

export default useInfiniteDevelopers; 