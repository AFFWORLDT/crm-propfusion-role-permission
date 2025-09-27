import { useQuery } from "@tanstack/react-query";
import { getRolesPermissions } from "../../../services/apiRoles";

export const useAllRolesPermissions = () => {
    const { data, isLoading , error } = useQuery({
        queryKey: ["roles-permissions"],
        queryFn: getRolesPermissions,
    });

    return { data, isLoading, error };
};
