import { useQuery } from "@tanstack/react-query";
import { getFollowUpReport } from "../../services/apiFollowUps";


export function useFollowUpsReports(id) {
    const {
        data: followUpsReports,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["followUpsReports", id],
        queryFn: () => getFollowUpReport(id),
    });

    return { followUpsReports, isLoading, error };
}
