import { useQuery } from "@tanstack/react-query";
import { getSmtp } from "../../services/apiSmtp";

function useSmtp() {
    const { isLoading, data, error } = useQuery({
        queryKey: ["smtp"],
        queryFn: () => getSmtp(), 
    });

    return { isLoading, data: data ?? [], error };
}

export default useSmtp;