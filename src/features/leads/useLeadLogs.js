import { useQuery } from "@tanstack/react-query";
import { getLeadLogs } from "../../services/apiLeads";
import { useParams } from "react-router-dom";

function useLeadLogs() {
    const { leadId } = useParams();
    const filters = {
        lead_id: leadId,
    };
    const { data, isPending, error } = useQuery({
        queryKey: ["lead-logs", filters],
        queryFn: () => getLeadLogs(filters),
    });
    return {
        data,
        isPending,
        error,
    };
}

export default useLeadLogs;
