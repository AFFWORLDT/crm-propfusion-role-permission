import { useQuery } from "@tanstack/react-query";
import { getRoles } from "../../../services/apiRoles";
import { useSearchParams } from "react-router-dom";

export function useGetRoles() {
    const [searchParams] = useSearchParams();

    const filters = {
        page: 1,
        limit: 1000,
    };
    for (const [key, val] of searchParams.entries()) {
        if (key === "page") {
            filters[key] = Number(val) || 1;
            continue;
        }
        if (val) filters[key] = val;
    }
    const {
        data: roles,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["roles", filters],
        queryFn: () => getRoles(filters),
    });

    return { roles, isLoading, error };
}
