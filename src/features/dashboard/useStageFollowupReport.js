import { useQuery } from "@tanstack/react-query";
import { getStageFollowupReport } from "../../services/apiProperties";

function useStageFollowupReport() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["stageFollowupReport"],
        queryFn: getStageFollowupReport,
        staleTime: 1000 * 60 * 5,
    });

    return { data: data ?? {}, isLoading, error };
}

export default useStageFollowupReport;


