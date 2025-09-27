import { useQuery } from "@tanstack/react-query";
import { getRoles } from "../../../services/apiTeams";

function useRoles() {
    const { isLoading, data, error } = useQuery({
        queryKey: ["roles"],
        queryFn: getRoles,
    });

    return { isLoading, data: data ?? [], error };
}

export default useRoles;
