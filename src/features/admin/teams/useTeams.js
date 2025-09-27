import { useQuery } from "@tanstack/react-query";
import { getTeams } from "../../../services/apiTeams";

function useTeams() {
    const { isLoading, data, error } = useQuery({
        queryKey: ["teams"],
        queryFn: getTeams,
    });

    return { isLoading, data: data ?? [], error };
}

export default useTeams;
