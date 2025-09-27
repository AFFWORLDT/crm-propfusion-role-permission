import { useQuery } from "@tanstack/react-query";
import { searchDevelopers } from "../../services/apiDevelopers";

export default function useDeveloperSearch(searchTerm, enabled = true) {
    const {
        data,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ["developers", "search", searchTerm],
        queryFn: ({ signal }) => searchDevelopers(searchTerm, signal),
        enabled: enabled && searchTerm?.length >= 2, // Only search when there are at least 2 characters
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });

    // Format the data for react-select
    const formattedData = data?.developers?.map(developer => ({
        value: developer.id,
        label: developer.name,
        ...developer
    })) || [];

    return {
        developers: formattedData,
        isLoading,
        error,
        refetch,
        totalCount: data?.totalDevelopers || 0
    };
}
