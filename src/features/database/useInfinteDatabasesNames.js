import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getDatabaseNames } from "../../services/apiCustomer";

function useInfiniteDatabasesNames() {
    const [searchParams] = useSearchParams();
    const filters = {
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
        queryKey: ["databases", filters],
        queryFn: ({ pageParam = 1 }) =>
            getDatabaseNames({ ...filters, page: pageParam }),
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage?.[0]?.length) return undefined;
            const nextPage = allPages.length + 1;
            return nextPage;
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
        databases: data?.pages.flatMap((page) => page) ?? [],
        totalSize: data?.pages[0]?.[0]?.length ?? 0,
    };
}

export default useInfiniteDatabasesNames;
