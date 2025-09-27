import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllOwner } from "../../services/apiOwner";
import { useSearchParams } from "react-router-dom";

function useInfiniteOwners(searchQuery = "", fetchAll=false) {
    const [searchParams] = useSearchParams();
    const filters = {

        owner_name: searchQuery,
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
        queryKey: ["owners", filters],
        queryFn: ({ pageParam = 1 }) => getAllOwner({ 
            ...filters, 
            page: pageParam,
        }, fetchAll),
        getNextPageParam: (lastPage) => {
            if (!lastPage?.owners?.length) return undefined;
            if (lastPage.page >= lastPage.total_pages) return undefined;
            return lastPage.page + 1;
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
        owners: data?.pages.flatMap((page) => page.owners || []) ?? [],
        totalSize: data?.pages[0]?.total ?? 0,
    };
}

export default useInfiniteOwners; 