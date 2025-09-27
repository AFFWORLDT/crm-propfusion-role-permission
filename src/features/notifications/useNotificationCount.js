import { useQuery } from "@tanstack/react-query";
import { getUnseenNotificationCount } from "../../services/apiNotifications";

function useUnseenNotificationCount() {
    const { isLoading, data, error } = useQuery({
        queryFn: getUnseenNotificationCount,
        queryKey: ["unseenNotificationCount"],
    });

    return {
        isLoading,
        data: data ?? 0,
        error,
    };
}

export default useUnseenNotificationCount;
