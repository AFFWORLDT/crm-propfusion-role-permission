import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchCustomers } from "../../services/apiCustomer";
import { useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

function useCustomers() {
    const [searchParams] = useSearchParams();
    const { ref, inView } = useInView({
        threshold: 0.1,
        rootMargin: "100px"
    });
    const filters = {};

    for (const [key, val] of searchParams.entries()) {
        if (key === "page") {
            filters[key] = Number(val) || 1;
            continue;
        }
        if (val) filters[key] = val;
    }

    const { 
        isLoading, 
        data, 
        error, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage 
    } = useInfiniteQuery({
        queryKey: ["customers", filters],
        queryFn: ({ pageParam = 1, signal }) => fetchCustomers({ ...filters, page: pageParam, limit: 1000 }, signal),
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage || lastPage.length === 0) return undefined;
            return lastPage.length === 1000 ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        keepPreviousData: true
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return { 
        isLoading, 
        error, 
        data: data?.pages?.flat() || [], 
        ref,
        isFetchingNextPage,
        hasNextPage
    };
}

export default useCustomers;
