import { useQuery } from "@tanstack/react-query";
import { getNewProperties } from "../../services/apiProperties";
import { useSearchParams } from "react-router-dom";

function usePropertiesAll(listing_type) {
    const [searchParams] = useSearchParams();
    const filters = {
        listing_type,
        sort: "CREATE_TIME",
        sortType: searchParams.get("sortType") ?? "DESC",
        status: searchParams.get("status") ?? "ACTIVE",
        size: 1000,
    };

    for (const [key, val] of searchParams.entries()) {
        if (val) filters[key] = val;
    }

    const {
        data,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["properties", filters],
        queryFn: () => getNewProperties(filters),
    });

    return {
        data,
        isLoading,
        error,
        properties: data?.properties ?? [],
        totalSize: data?.totalProperties ?? 0,
    };
}

export default usePropertiesAll;
