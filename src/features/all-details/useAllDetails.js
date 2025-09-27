import { useQuery } from "@tanstack/react-query";
import { fetchCurrentLoggedInUserAllData } from "../../services/apiAllData";
import { useAuth } from "../../context/AuthContext";

const useAllDetails = () => {
    const { logout } = useAuth();
    
    const { data, error, isLoading } = useQuery({
        queryKey: ["all-details"],
        queryFn: fetchCurrentLoggedInUserAllData,
        refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
        onError: (error) => {
            if (error.message === "No user found" || error.message === "Unauthorized") {
                logout();
            }
        },
        retry: (failureCount, error) => {
            // Don't retry for authentication errors
            if (error.message === "No user found" || error.message === "Unauthorized") {
                return false;
            }
            return failureCount < 3; // retry up to 3 times for other errors
        }
    });

    return {
        data: data || [], // Ensure we always return an array
        error,
        isLoading,
    };
};

export default useAllDetails;
