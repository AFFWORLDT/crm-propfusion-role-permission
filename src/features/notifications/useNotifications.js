import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getNotifications } from "../../services/apiNotifications";
import { PAGE_SIZE } from "../../utils/constants";

function useNotifications() {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();

    const baseFilters = {};
    for (const [key, val] of searchParams.entries()) {
        if (key === "page") continue;
        if (val) baseFilters[key] = val;
    }

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        status,
    } = useInfiniteQuery({
        queryKey: ["notifications-infinite", baseFilters],
        queryFn: ({ pageParam = 1, signal }) => {
            const filters = { ...baseFilters, page: pageParam };
            return getNotifications(filters, signal);
        },
        getNextPageParam: (lastPage, allPages) => {
            
            const totalPages = Math.ceil(lastPage.totalNotification / PAGE_SIZE);
            const nextPage = allPages.length + 1;
            return nextPage <= totalPages ? nextPage : undefined;
        },
        initialPageParam: 1,
    });

    const allNotifications = data?.pages.flatMap(page => page.notifications) || [];
    const totalSize = data?.pages[0]?.totalNotifications || 0;
    const unseenNotificationCountsByType = data?.pages[0]?.unseenNotificationCountsByType || {};

    return {
        isLoading,
        isFetchingNextPage,
        data: allNotifications,
        totalSize,
        unseenNotificationCountsByType,
        error,
        fetchNextPage,
        hasNextPage,
    };
}

export default useNotifications;