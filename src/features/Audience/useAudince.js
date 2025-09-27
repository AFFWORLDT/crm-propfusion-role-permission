import { useQuery } from "@tanstack/react-query";
import { getAudience,getAudienceId } from "../../services/apiAudience";


function useAudiences(page, size, audienceType = null) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["audience", page, size, audienceType],
    queryFn: () => getAudience(page, size, audienceType),
  });

  return { isLoading, data: data ?? [], error };
}

export default useAudiences;

export function useAudiencesById(Id) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["audience", Id], 
    queryFn: () => getAudienceId(Id),
    enabled: !!Id, 
    initialData: undefined
  });
   
  return { isLoading, data: data ?? [], error };
}
