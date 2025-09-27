import { useQuery } from "@tanstack/react-query";
import { getSmtpId } from "../../services/apiSmtp";

function useSmtpById(id) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["smtp", id],
    queryFn: () => getSmtpId(id),
    enabled: !!id, 
    initialData: undefined
  });

  return { isLoading, data: data ?? [], error };
}

export default useSmtpById;