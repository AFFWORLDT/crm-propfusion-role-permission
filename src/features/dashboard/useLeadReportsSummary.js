import { useQuery } from "@tanstack/react-query";
import { getLeadReportsSummary } from "../../services/apiProperties";

function useLeadReportsSummary(page = 1, size = 10) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["leadReportsSummary", page, size],
    queryFn: () => getLeadReportsSummary(page, size),
    staleTime: 1000 * 60 * 5,
  });

  return { data: data ?? {}, isLoading, error };
}

export default useLeadReportsSummary;


