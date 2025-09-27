import { useQuery } from "@tanstack/react-query"
import { getPropertiesLogs } from "../../services/apiProperties"
import { useParams } from "react-router-dom";

function usePropertyLogs() {
    const { propertyId } = useParams();

    const filters = {
        property_id:propertyId,
    };
    const { data: propertyLogsData, error, isLoading } = useQuery({
        queryKey: ['propertyLogs', filters],
        queryFn: () => getPropertiesLogs(filters),
    })
    return {
        propertyLogsData, error, isLoading
    }
}

export default usePropertyLogs

