import { useInfiniteQuery } from "@tanstack/react-query";
import { getSmsClick } from "../../../services/apiLeads";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

function useInfinitesms() {
    const [searchParams] = useSearchParams();

    const filters = {
        sort_order: "DESC",
        page: 1,
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
        queryKey: ["sms", filters],
        queryFn: async ({ pageParam = 1 }) => {
            try {
                const response = await getSmsClick({ 
                    ...filters, 
                    page: pageParam,
                });
                
                if (!response) {
                    throw new Error('No response from API');
                }
                
                // Log the response for debugging
                console.log('Portal Calls Response:', response);
                
                return response;
            } catch (err) {
                console.error('Portal Calls Error:', err);
                toast.error(err.message || 'Failed to fetch portal calls');
                throw err;
            }
        },
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage?.sms_clicks?.length) return undefined;
            if (lastPage?.sms_clicks <= (allPages.length * 24)) return undefined;
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
        portalCalls: data?.pages?.flatMap((page) => page?.sms_clicks || []) ?? [],
        totalSize: data?.pages?.[0]?.totalCalls ?? 0,
    };
}

export default useInfinitesms; 