import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { getBuilding } from "../../services/apiBuilding";

function useInfiniteBuilding() {
    const [searchParams] = useSearchParams();
    const {id}=useParams()
    const filters = id 
        ? { building_id: id }
        : {
            sort_by_date: searchParams.get("sortType") ?? "DESC",
            building_status: searchParams.get("status") ?? "ACTIVE",
        };

    if (!id) {
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
        queryKey: ["building", filters],
        queryFn: ({ pageParam = 1 }) => {
            return getBuilding({ 
                ...filters,
                page: pageParam,
            });
        },
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage.buildings.length) return undefined;
            
            const totalPages = Math.ceil(lastPage.totalBuildings / 12);
            const nextPage = allPages.length + 1;
            
            return nextPage <= totalPages ? nextPage : undefined;
        },
        initialPageParam: 1,
    });

    const allProjects = data?.pages.flatMap((page) => page.buildings) ?? [];
    const totalProjects = data?.pages[0]?.totalBuildings ?? 0;

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

export default useInfiniteBuilding;
