import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getBayutLeads } from "../../../services/apiBayutLeads";

function useBayutLeads() {
    const [searchParams] = useSearchParams();

    const filters = {
        lead_type: "leads",
    };
    for (const [key, value] of searchParams.entries()) {
        if (value) {
            filters[key] = value;
        }
    }
    const { data, error, isLoading } = useQuery({
        queryFn: () => getBayutLeads(filters),
        queryKey: ["bayutLeads", filters],
    });
    return {
        isLoading,
        data: data?.leads ?? [],
        error,
        totalSize: data?.count ?? 0,
    };
}
export default useBayutLeads;
