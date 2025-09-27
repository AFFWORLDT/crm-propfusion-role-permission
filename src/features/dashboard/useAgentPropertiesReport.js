import { useQuery } from "@tanstack/react-query";
import { getAgentPropertiesReport } from "../../services/apiProperties";

function useAgentPropertiesReport() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["agentPropertiesReport"],
    queryFn: getAgentPropertiesReport,
    staleTime: 1000 * 60 * 5,
  });

  return { data: data ?? {}, isLoading, error };
}

export default useAgentPropertiesReport;
