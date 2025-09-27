import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
    getMainSiteProperties,
    // getNewProperties,
    getNewPropertiesByPropertyIdV2,
} from "../../services/apiProperties";

function useNewProperty(id) {
    const { propertyId } = useParams();
    
    const effectiveId = propertyId || id;

    const { isLoading, data, error } = useQuery({
        queryFn: ({ signal }) =>
            getNewPropertiesByPropertyIdV2(effectiveId, signal),
        queryKey: ["newProperty", effectiveId],
        enabled: !!effectiveId,
    });

    return {
        isLoading,
        data: data?.property ? [data?.property] : [],
        error,
    };
}

export default useNewProperty;

export function useMainSiteProperty() {
    const { propertyId } = useParams();

    const filters = {
        property_id: propertyId,
    };

    const { isLoading, data, error } = useQuery({
        queryFn: () => getMainSiteProperties(filters),
        queryKey: ["newProperty", filters],
    });

    return {
        isLoading,
        data: data?.properties ?? [],
        error,
    };
}
