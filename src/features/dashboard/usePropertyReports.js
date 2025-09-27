import { useQuery } from "@tanstack/react-query";
import { getPropertyReports } from "../../services/apiProperties";

function usePropertyReports(type) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["propertyReports", type],
        queryFn: () => getPropertyReports(type),
    });

    return { data, isLoading, error };
}

export default usePropertyReports;
