import { useQuery } from "@tanstack/react-query";
import { getStaff } from "../../../services/apiStaff";

function useStaff(agentId) {
    const { isLoading, data, error } = useQuery({
        queryKey: ["staff", agentId],
        queryFn: () => getStaff(agentId), 
    });

    return { isLoading, data: data ?? [], error };
}

export default useStaff;
