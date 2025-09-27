import { useQuery } from "@tanstack/react-query";
import { getRole } from "../../../services/apiRoles";

export function useGetRole(roleId) {
  const {
    data: role,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["role", roleId],
    queryFn: () => getRole(roleId),
    enabled: Boolean(roleId),
  });

  return { role, isLoading, error };
}
