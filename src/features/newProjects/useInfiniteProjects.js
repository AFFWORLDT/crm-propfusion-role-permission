import { useInfiniteQuery } from "@tanstack/react-query";
import { getProjects } from "../../services/apiNewProjects";
import { useSearchParams } from "react-router-dom";

function useInfiniteProjects(customFilters = {}) {
    const [searchParams] = useSearchParams();
    let filters = {};
    if (
        customFilters &&
        customFilters.developer_id &&
        customFilters.status === "POOL"
    ) {
        filters = {
            developer_id: customFilters.developer_id,
            status: "POOL",
            size: 12,
            sort_by_date: "ASC", // Changed from DESC to ASC
            ...(customFilters.min_price && { min_price: customFilters.min_price }),
            ...(customFilters.max_price && { max_price: customFilters.max_price }),
            ...(customFilters.handover_year && { handover_year: customFilters.handover_year }),
        };
    } else {
        filters = {
        sort_by_date: searchParams.get("sortType") ?? "DESC", // Changed from DESC to ASC
        project_status: searchParams.get("status") ?? "ACTIVE",
    };
    for (const [key, val] of searchParams.entries()) {
        if (val) filters[key] = val;
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
        queryKey: ["projects", filters],
        queryFn: ({ pageParam = 1 }) => {
            return getProjects({ 
                ...filters,
                page: pageParam,
            });
        },
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage.projects.length) return undefined;
            
            const totalPages = Math.ceil(lastPage.totalProjects / 12);
            const nextPage = allPages.length + 1;
            
            return nextPage <= totalPages ? nextPage : undefined;
        },
        initialPageParam: 1,
    });

    const allProjects = data?.pages.flatMap((page) => page.projects) ?? [];
    const totalProjects = data?.pages[0]?.totalProjects ?? 0;

    return {
        projects: allProjects,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        totalSize: totalProjects,
    };
}

export default useInfiniteProjects;
