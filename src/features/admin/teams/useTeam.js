import { useQuery } from "@tanstack/react-query";
import { getTeamById } from "../../../services/apiTeams";

function useTeam(id) {
    const { isLoading, data, error } = useQuery({
        queryKey: ["team", id],
        queryFn: () => getTeamById(id), 
    });

    return { isLoading, data: data ?? {}, error };
}

export default useTeam;
