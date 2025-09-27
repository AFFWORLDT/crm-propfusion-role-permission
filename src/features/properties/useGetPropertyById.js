import { useQuery } from "@tanstack/react-query";
import { getPropertyById } from "../../services/apiProperties";

function useGetPropertyById(id) {
    const { isLoading, data, error } = useQuery({
        queryFn: () => getPropertyById(id),
        queryKey: ["newProperty", id],
    });

    return {
        isLoading,
        data: data?.properties ?? [],
        error,
    };
}

export default useGetPropertyById;
