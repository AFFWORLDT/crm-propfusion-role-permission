import { useQuery } from "@tanstack/react-query";
import { getAmenities } from "../../services/apiAmenities";

function useAmenities() {
    const { isLoading, data, error } = useQuery({
        queryFn: () => getAmenities(),
        queryKey: ["amenities"],
    });

    return {
        isLoading,
        data,
        error,
    };
}

export default useAmenities;
