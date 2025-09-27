import { useQuery } from "@tanstack/react-query";
import { getRating } from "../../services/apiRating";

function useRating(ratingType) {
    const { isLoading, data, error } = useQuery({
        queryFn: () => getRating(ratingType),
        queryKey: ["ratings", ratingType],
    });

    return {
        isLoading,
        data: data ?? [],
        error,
    };
}

export default useRating;
