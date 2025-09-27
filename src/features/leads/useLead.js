import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getLeads } from "../../services/apiLeads";

function useLead() {
    const { leadId } = useParams();

    const filters = {
        lead_id: leadId,
    };

    const { isLoading, data, error } = useQuery({
        queryFn: () => getLeads(filters),
        queryKey: ["lead", filters],
    });

    return {
        isLoading,
        data: data?.leads ?? [],
        error,
    };
}

export default useLead;
