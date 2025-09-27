import { useQuery } from "@tanstack/react-query";
import { getFollowUps } from "../../services/apiFollowUps";

function useFollowUps(type, targetId) {
    const { isLoading, data, error } = useQuery({
        queryFn: () => getFollowUps(type, targetId),
        queryKey: ["followUps", type, targetId],
    });

    return {
        isLoading,
        data: data ?? [],
        error,
    };
}

export default useFollowUps;
