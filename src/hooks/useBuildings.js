import { useQuery } from "@tanstack/react-query";
import { getBuildingList } from "../services/apiBuilding";

function useBuildings(filters = {}, fetchAll = false) {
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