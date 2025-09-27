import { useInfiniteQuery } from "@tanstack/react-query";
import { getPhoneView } from "../../../services/apiLeads";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

function useInfinitePhone() {
    const [searchParams] = useSearchParams();

    const filters = {
        sort_order: "DESC",
        page: 1,
        per_page: 12, // Set default per_page to 12
    };
    for (const [key, val] of searchParams.entries()) {
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
        queryKey: ["phone", filters],
        queryFn: async ({ pageParam = 1 }) => {
            try {
                const response = await getPhoneView({ 
                    ...filters, 
                    page: pageParam,
                });
                
                if (!response) {
                    throw new Error('No response from API');
                }
                
                return response;
            } catch (err) {
                console.error('Phone Views Error:', err);
                toast.error(err.message || 'Failed to fetch phone views');
                throw err;
            }
        },
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage?.phone_views?.length) return undefined;
            const totalPages = Math.ceil(lastPage.count / lastPage.per_page);
            if (allPages.length >= totalPages) return undefined;
            return allPages.length + 1;
        },
        initialPageParam: 1,
    });

    return {
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        phoneViews: data?.pages?.flatMap((page) => page?.phone_views || []) ?? [],
        totalSize: data?.pages?.[0]?.count ?? 0,
    };
}

export default useInfinitePhone; 