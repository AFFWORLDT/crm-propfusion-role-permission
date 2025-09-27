import { useQuery } from "@tanstack/react-query";
import { getAllPortalRequests } from "../../../services/apiRequests";
import { useSearchParams } from "react-router-dom";

export function usePortalRequest() {
    const [searchParams] = useSearchParams();
    const filters = {
        sort_order: "desc",
    };
    for (const [key, value] of searchParams.entries()) {
        if (value) {
            filters[key] = value;
        }
    }
    const {
        isPending,
        data: requestsData,
        error,
    } = useQuery({
        queryKey: ["portal-requests", filters],
        queryFn: () => getAllPortalRequests(filters),
    });

    return {
        isPending,
        requestsData,
        error,
    };
}
