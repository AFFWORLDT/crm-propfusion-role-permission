import { useQuery } from "@tanstack/react-query";
import { getAgentLeadsReport } from "../../services/apiProperties";

function useAgentLeadsReport() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["agentLeadsReport"],
    queryFn: getAgentLeadsReport,
    staleTime: 1000 * 60 * 5,
  });

  return { data: data ?? {}, isLoading, error };
}

export default useAgentLeadsReport;
