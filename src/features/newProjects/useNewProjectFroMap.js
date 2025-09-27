import { useQuery } from "@tanstack/react-query";
import { getNewProjectsForMaps } from "../../services/apiNewProjects";

function useNewProjectForMaps() {

    const { isLoading, data, error } = useQuery({
        queryFn: ({ signal }) => getNewProjectsForMaps( signal),
        queryKey: ["newPropertiesForMaps"],
    });

    return {
        isLoading,
        data: data ?? [],
        error,
    };
}

export default useNewProjectForMaps;
