import { useQuery } from "@tanstack/react-query";
import { getNewPropertiesForMaps } from "../../services/apiProperties";
import { useSearchParams } from "react-router-dom";

function useNewPropertiesForMaps() {
    const [searchParams] = useSearchParams();
    const listingType = searchParams.get("listingType");

    const { isLoading, data, error } = useQuery({
        queryFn: ({ signal }) => getNewPropertiesForMaps(listingType, signal),
        queryKey: ["newPropertiesForMaps", listingType],
    });

    return {
        isLoading,
        data: data ?? [],
        error,
    };
}

export default useNewPropertiesForMaps;
