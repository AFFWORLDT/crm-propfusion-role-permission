import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getProperties } from "../../services/apiProperties";

function useProperty() {
    const { propertyId } = useParams();

    const filters = {
        propertyId,
    };

    const { isLoading, data, error } = useQuery({
        queryFn: () => getProperties(filters),
        queryKey: ["property", filters],
    });

    return {
        isLoading,
        data: data?.list ?? [],
        error,
    };
}

export default useProperty;
