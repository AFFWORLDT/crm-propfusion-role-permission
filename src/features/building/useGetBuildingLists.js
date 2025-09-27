import { useQuery } from "@tanstack/react-query";
import { getBuildingList } from "../../services/apiBuilding";
import { useSearchParams } from "react-router-dom";
function useBuildings(fetchAll = false) {
    const [searchParams] = useSearchParams();
    const filters = {
    };

    for (const [key, val] of searchParams.entries()) {
        if (val) filters[key] = val;
    }
    const { data, isLoading, error } = useQuery({
        queryKey: ["buildings", filters, fetchAll],
        queryFn: () => getBuildingList(filters, fetchAll),
    });

    return {
        buildings: data ?? [],
        isLoading,
        error
    };
}

export default useBuildings;