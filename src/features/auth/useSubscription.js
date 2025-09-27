import { useQuery } from "@tanstack/react-query";
import { getSubscriptionStatus } from "../../services/apiAuth";

function useSubscription() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["subscription"],
        queryFn: getSubscriptionStatus,
    });

    return { data: data ?? {}, isLoading, error };
}

export default useSubscription;
