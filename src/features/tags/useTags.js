import { useQuery } from "@tanstack/react-query";
import { getTags } from "../../services/apiTags";

function useTags(tagType) {
    const { isLoading, data, error } = useQuery({
        queryFn: () => getTags(tagType),
        queryKey: ["tags", tagType],
        staleTime: 120000, // 2 minutes
        cacheTime: 120000, // 2 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    return {
        isLoading,
        data: data ?? [],
        error,
    };
}

export default useTags;
