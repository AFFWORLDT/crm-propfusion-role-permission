import { useInfiniteQuery } from "@tanstack/react-query";
import { getVehicleLists } from "../../services/apiVehicles";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";

function useInfiniteVehicles(listingType) {
    const [searchParams] = useSearchParams();
    const filters = {
        listing_type:listingType,
        sort: "CREATE_TIME",
        sortType: searchParams.get("sortType") ?? "DESC",
        status: searchParams.get("status") ?? "ACTIVE"
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
        queryKey: ["vehicles", filters],
        queryFn: ({ pageParam = 1 }) =>
            getVehicleLists({ ...filters, page: pageParam }, false),
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage.vehicles.length) return undefined;
            const totalPages = Math.ceil(lastPage.total / PAGE_SIZE);
            const nextPage = allPages.length + 1;
            return nextPage <= totalPages ? nextPage : undefined;
        },
        initialPageParam: 1,
        staleTime: 1000,
    });

    return {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        vehicles: data?.pages.flatMap((page) => page.vehicles) ?? [],
        totalSize: data?.pages[0]?.total ?? 0,
    };
}

export default useInfiniteVehicles;
