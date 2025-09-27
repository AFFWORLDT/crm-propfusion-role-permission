import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getBayutLeads } from "../../../services/apiBayutLeads";

function useBayutWhatsappLeads() {
    const [searchParams] = useSearchParams();

    const filters = {
        lead_type: "whatsapp_leads",
    };

    for (const [key, value] of searchParams.entries()) {
        if (value) filters[key] = value;
    }

    const { isLoading, data, error } = useQuery({
        queryFn: () => getBayutLeads(filters),
        queryKey: ["bayut-wp-leads", filters],
    });
    return {
        isLoading,
        data: data?.leads ?? [],
        error,
        totalSize: data?.count ?? 0,
    };
}
export default useBayutWhatsappLeads;
