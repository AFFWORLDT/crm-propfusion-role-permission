import { useQuery } from "@tanstack/react-query";
import { getLocationWihLocationType } from "../../services/apiLocations";
import { useSearchParams } from "react-router-dom";

export function useLocationWihLocationType(fetchAll = false,locationType) {
    const [searchParams] = useSearchParams();

    let filters = {
        location_type: searchParams.get("location_type") || "city",
    };
    for (const [key, val] of searchParams.entries()) {
        if (key === "page") {
            filters[key] = Number(val) || 1;
            continue;
        }
        if (val) filters[key] = val;
    }
    const { data, isLoading, error } = useQuery({
        queryKey: ["locationWihLocationType", filters],
        queryFn: ({ signal }) =>
            getLocationWihLocationType(filters, fetchAll, signal),
    });

    return { data, isLoading, error };
}
