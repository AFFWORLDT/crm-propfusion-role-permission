import { useQuery } from "@tanstack/react-query";
import { getViewing } from "../../services/apiAllViewing";

export const useGetViewing = (viewingId) => {
    const {
        data: viewing,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["viewing", viewingId],
        queryFn: () => getViewing(viewingId),
        enabled: !!viewingId, 
    });

    return {
        viewing,
        isLoading,
        error,
    };
};

export default useGetViewing; 