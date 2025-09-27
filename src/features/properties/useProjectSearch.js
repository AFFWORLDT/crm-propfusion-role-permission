import { useQuery } from "@tanstack/react-query";
import { searchProjects } from "../../services/apiNewProjects";

export default function useProjectSearch(searchTerm, enabled = true) {
    const {
        data,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ["projects", "search", searchTerm],
        queryFn: ({ signal }) => searchProjects(searchTerm, signal),
        enabled: enabled && searchTerm?.length >= 2, // Only search when there are at least 2 characters
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });

    // Format the data for react-select
    const formattedData = data?.projects?.map(project => ({
        value: project.id,
        label: project.name,
        ...project
    })) || [];

    return {
        projects: formattedData,
        isLoading,
        error,
        refetch,
        totalCount: data?.totalProjects || 0
    };
}
