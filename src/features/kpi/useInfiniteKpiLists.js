import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getKpiLists } from "../../services/apiKpi";

function useInfiniteKpiLists() {
    const [searchParams] = useSearchParams();
    const filters = {
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
        queryKey: ["kpiLists", filters],
        queryFn: ({ pageParam = 1 }) =>
            getKpiLists({ ...filters, page: pageParam }),
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage.data?.length) return undefined;
            const totalPages = lastPage.pages;
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
        agentData: data?.pages.flatMap((page) => page.data) ?? [],
        pagination: {
            currentPage: data?.pages[0]?.page ?? 1,
            totalPages: data?.pages[0]?.pages ?? 1,
            totalItems: data?.pages[0]?.total ?? 0,
            pageSize: data?.pages[0]?.size ?? 12
        }
    };
}

export default useInfiniteKpiLists;