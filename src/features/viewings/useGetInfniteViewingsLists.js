import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getViewingLists } from "../../services/apiAllViewing";

function useInfiniteViewingsLists (id ,fetchAll) {
    const [searchParams] = useSearchParams();
    const filters = {
        ...(id && { property_id: id })
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
        queryKey: ["viewingsLists", filters],
        queryFn: ({ pageParam = 1 }) =>
            getViewingLists ({ ...filters, page: pageParam, }, fetchAll),
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage.viewings.length) return undefined;
            const totalPages = Math.ceil(lastPage.total / lastPage.size);
            const nextPage = allPages.length + 1;
            return nextPage <= totalPages ? nextPage : undefined;
        },
        initialPageParam: 1,
        staleTime: 1000,
        cacheTime: 1000 * 60 * 30,
    });

    return {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        viewings: data?.pages.flatMap((page) => page.viewings) ?? [],
        totalSize: data?.pages[0]?.total ?? 0,
    };
}

export default useInfiniteViewingsLists;