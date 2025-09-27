import { useQuery } from "@tanstack/react-query";
import { getProjectsReport } from "../../services/apiProperties";

function useProjectsReport() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["projectsReport"],
    queryFn: getProjectsReport,
    staleTime: 1000 * 60 * 5,
  });

  return { data: data ?? {}, isLoading, error };
}

export default useProjectsReport;
