import { useQuery } from "@tanstack/react-query";
import { getConnectedPages } from "../../../services/apiMetaAds";

const useGetConnectedPages = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["connected-pages"],
        queryFn: getConnectedPages,
    });
    return { data, isLoading, error };
};

export default useGetConnectedPages;
