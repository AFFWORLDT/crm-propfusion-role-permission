import { useInfiniteQuery } from "@tanstack/react-query";
import { getWhatappsClick } from "../../../services/apiLeads";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

function useWhatapp() {
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
        queryKey: ["whatapp", filters],
        queryFn: async ({ pageParam = 1 }) => {
            try {
                const response = await getWhatappsClick({ 
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
            if (!lastPage?.whatsapp_views?.length) return undefined;
            if (lastPage?.whatsapp_views <= (allPages.length * 24)) return undefined;
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
        portalCalls: data?.pages?.flatMap((page) => page?.whatsapp_views || []) ?? [],
        totalSize: data?.pages?.[0]?.totalCalls ?? 0,
    };
}

export default useWhatapp; 