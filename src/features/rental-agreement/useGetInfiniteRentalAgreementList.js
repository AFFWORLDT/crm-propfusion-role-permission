import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllRentalAgreement } from "../../services/apiRentalAgreeMent";
import { useSearchParams } from "react-router-dom";

function useGetInfiniteRentalAgreementList() {
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
        queryKey: ["rental-agreement-list", filters],
        queryFn: ({ pageParam = 1 }) => getAllRentalAgreement({ ...filters, page: pageParam }),
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage?.agreements?.length) return undefined;
            const totalPages = Math.ceil(lastPage.total / 10);
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
        agreements: data?.pages.flatMap((page) => page.agreements) ?? [],
        totalSize: data?.pages[0]?.total ?? 0,
        totalPages: data?.pages[0]?.total_pages ?? 0,
    };
}

export default useGetInfiniteRentalAgreementList;
