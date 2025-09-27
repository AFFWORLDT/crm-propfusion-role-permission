import { useQuery } from "@tanstack/react-query";
import { getPropertyFinderXmlFeed } from "../../../services/apiIntegrations";

function usePropertyFinderXmlFeed() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["propertyFinderXmlFeed"],
        queryFn: getPropertyFinderXmlFeed,
    });

    return { data: data ?? "", isLoading, error };
}

export default usePropertyFinderXmlFeed;
