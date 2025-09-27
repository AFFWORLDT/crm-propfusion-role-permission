import { useQuery } from "@tanstack/react-query";
import { getBayutXmlFeed } from "../../../services/apiIntegrations";

function useBayutXmlFeed() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["bayutXmlFeed"],
        queryFn: getBayutXmlFeed,
    });

    return { data: data ?? "", isLoading, error };
}

export default useBayutXmlFeed;
