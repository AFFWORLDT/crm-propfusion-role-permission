import { useInfiniteQuery } from "@tanstack/react-query";
import { getNewProperties } from "../../services/apiProperties";
import { useSearchParams } from "react-router-dom";

function useInfiniteProperties(listing_type,fetchAll=false) {
    const [searchParams] = useSearchParams();
    const filters = {
        listing_type,
        sort: "CREATE_TIME",
        sortType: searchParams.get("sortType") ?? "DESC",
        status: searchParams.get("status") ?? "ACTIVE",
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
        queryKey: ["newProperties", filters],
        queryFn: ({ pageParam = 1 }) =>
            getNewProperties({ ...filters, page: pageParam, },fetchAll),
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage.properties.length) return undefined;
            const totalPages = Math.ceil(lastPage.totalProperties / 12);
            const nextPage = allPages.length + 1;
            return nextPage <= totalPages ? nextPage : undefined;
        },
        initialPageParam: 1,
        cacheTime: 1000 * 60 * 30,
    });

    return {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        properties: data?.pages.flatMap((page) => page.properties) ?? [],
        totalSize: data?.pages[0]?.totalProperties ?? 0,
    };
}

export default useInfiniteProperties;
