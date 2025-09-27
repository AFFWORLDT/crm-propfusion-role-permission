import { useQuery } from "@tanstack/react-query";
import { getPageFormsById } from "../../../services/apiMetaAds";

const useGetPageFormsById = (pageId) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["page-forms", pageId],
        queryFn: () => getPageFormsById(pageId),
        enabled: !!pageId,
    });

    return { data, isLoading, error };
};

export default useGetPageFormsById; 