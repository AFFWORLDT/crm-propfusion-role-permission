import { useQuery } from "@tanstack/react-query";
import { getFusionMail,getFusionMailId} from "../../services/apiFusionMail";

function useFusionmail(page, size) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["fusionmail", page, size], 
    queryFn: () => getFusionMail(page, size),
  });

  return { isLoading, data: data ?? [], error };
}

export default useFusionmail;


export function useFusionMailById(Id) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["fusionmail", Id], 
    queryFn: () => getFusionMailId(Id),
    enabled: !!Id, 
    initialData: undefined,
  });

  return { isLoading, data: data ?? [], error };
}
