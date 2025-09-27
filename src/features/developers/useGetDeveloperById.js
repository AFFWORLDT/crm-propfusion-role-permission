import { useQuery } from "@tanstack/react-query";
import { getDeveloperById } from "../../services/apiDevelopers";

function useGetDeveloperById(id) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["developers", id],
        queryFn: () => getDeveloperById(id),
        enabled: !!id,
    });

    return { data, isLoading, error };
}

export default useGetDeveloperById;

