import { useQuery } from "@tanstack/react-query";
import { getMetaAdFormById } from "../../../services/apiMetaAds";

// Get single meta ad form
export function useMetaAdForm(formId) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["meta-ad-form", formId],
        queryFn: () => getMetaAdFormById(formId),
        enabled: !!formId, // Only run query if formId is provided
    });
    return { data, isLoading, error };
}
