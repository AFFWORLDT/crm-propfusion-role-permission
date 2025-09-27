import { useInfiniteQuery } from "@tanstack/react-query";
import { getWhatsappLeads } from "../../../services/apiLeads";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { WP_LEAD_CLAIM_OPTIONS } from "../../../utils/constants";

function useInfiniteWhatsappLeads() {
    const [searchParams] = useSearchParams();
    const filters = {
        claimed: searchParams.get("claimed") || WP_LEAD_CLAIM_OPTIONS[2].value
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
        refetch,
    } = useInfiniteQuery({
        queryKey: ["whatsappLeads", filters],
        queryFn: async ({ pageParam = 1 }) => {
            try {
                const response = await getWhatsappLeads({
                    ...filters,
                    page: pageParam,
                });

                if (!response) {
                    throw new Error('No response from API');
                }

                return response;
            } catch (err) {
                console.error('Whatsapp Leads Error:', err);
                toast.error(err.message || 'Failed to fetch whatsapp leads');
                throw err;
            }
        },
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage?.leads?.length) return undefined;
            if (lastPage?.count <= (allPages.length * 12)) return undefined;
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
        whatsappLeads: data?.pages?.flatMap((page) => page?.leads || []) ?? [],
        totalSize: data?.pages?.[0]?.count ?? 0,
        refetch,
    };
}

export default useInfiniteWhatsappLeads; 