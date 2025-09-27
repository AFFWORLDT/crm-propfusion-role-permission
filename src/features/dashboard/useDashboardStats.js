import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../../services/apiDashboard";

function useDashboardStats() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["dashboardStats"],
        queryFn: getDashboardStats,
    });

    return { data: data ?? {}, isLoading, error };
}

export default useDashboardStats;
