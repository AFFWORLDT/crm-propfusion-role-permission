import { useQuery } from "@tanstack/react-query";
import { getAllMetaAds } from "../../../services/apiMetaAds";

function useAllMetaAds() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["metaAds"],
        queryFn: getAllMetaAds,
    });

    return { data, isLoading, error };
}

export default useAllMetaAds;
