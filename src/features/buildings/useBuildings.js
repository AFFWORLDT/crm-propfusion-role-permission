import { useQuery } from "@tanstack/react-query";
import { getBuildNameList } from "../../services/apiBuilding";

function useBuildings() {
    const { isLoading, data } = useQuery({
        queryKey: ["buildings-list"],
        queryFn: () => getBuildNameList(),
        select: (data) => {
            return data?.map((item) => ({
                value: item?.id,
                label: item?.building_name,
            }));
        },
    });

    return { buildings: data || [], isLoading };
}

export default useBuildings; 