import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllPortalRequests } from "../../../services/apiRequests";
import { useSearchParams } from "react-router-dom";

function useInfinitePortalRequest() {
    const [searchParams] = useSearchParams();
    const filters = {
        sort_order: "desc",
    };
    for (const [key, value] of searchParams.entries()) {
        if (value) {
            filters[key] = value;
        }
    }

    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["infinite-portal-requests", filters],
        queryFn: ({ pageParam = 1 }) =>
            getAllPortalRequests({ ...filters, page: pageParam }),
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage.requests.length) return undefined;
            const totalPages = Math.ceil(lastPage.total / 12);
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
        requests: data?.pages.flatMap((page) => page.requests) ?? [],
        totalSize: data?.pages[0]?.total ?? 0,
    };
}

export default useInfinitePortalRequest;
