import { useQuery } from "@tanstack/react-query";
import { getGetMePermission } from "../services/apiSidebar";

export function useMyPermissions() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['userPermissions'],
    queryFn: getGetMePermission,
    staleTime: 0, // Always fetch fresh data
    cacheTime: 0, // Don't cache
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const hasPermission = (permission) => {
    if (!data || !Array.isArray(data.permissions)) return false;
    return data.permissions.includes(permission);
  };

  return {
    ...data,
    hasPermission,
    isLoading,
    error,
  };
}
