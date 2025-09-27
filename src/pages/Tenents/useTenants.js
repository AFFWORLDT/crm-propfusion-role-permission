import { getAllTenants, getTenant } from "../../services/apiTenants";
import { useQuery } from "@tanstack/react-query";

const useTenants = ()=>{
    const {data, isLoading, isError} = useQuery({
        queryKey: ["tenents"],
        queryFn: getAllTenants,
    })
    return {data, isLoading, isError}
}

export function useTenant(id) {
  const { data: tenant, isLoading } = useQuery({
    queryKey: ['tenant', id],
    queryFn: () => getTenant(id),
  });

  return { tenant, isLoading };
}

export default useTenants