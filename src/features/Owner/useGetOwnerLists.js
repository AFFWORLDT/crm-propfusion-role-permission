import { useQuery } from "@tanstack/react-query";
import { getOwnerList } from "../../services/apiOwner";
export const useGetOwnerLists = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["owners"],
        queryFn: () => getOwnerList(),
    });
    return { data, isLoading, error };
};
