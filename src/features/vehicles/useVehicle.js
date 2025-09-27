import { useQuery } from "@tanstack/react-query";
import { getVehicle } from "../../services/apiVehicles";

function useVehicle(vehicleId) {
    const { isLoading, data, error } = useQuery({
        queryFn: () => getVehicle(vehicleId),
        queryKey: ["vehicle", vehicleId],
        enabled: !!vehicleId,
    });

    return { isLoading, error, data };
}

export default useVehicle; 