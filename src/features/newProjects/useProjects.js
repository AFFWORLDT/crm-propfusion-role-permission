import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getProjects } from "../../services/apiNewProjects";
import { PAGE_SIZE } from "../../utils/constants";

function useProjects() {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();

    const filters = {
        sort_by_date: searchParams.get("sortType") ?? "DESC",
        project_status: searchParams.get("status") ?? "ACTIVE",
        page: 1,
    };
    for (const [key, val] of searchParams.entries()) {
        if (key === "page") {
            filters[key] = Number(val) || 1;
            continue;
        }
        if (val) filters[key] = val;
    }

    const { isLoading, data, error } = useQuery({
        queryFn: ({ signal }) => getProjects(filters, signal),
        queryKey: ["projects", filters],
    });

    // Pre-fetching Data
    const pageCount = Math.ceil(data?.totalProjects / PAGE_SIZE);

    if (filters.page && filters.page < pageCount) {
        const newFilters = { ...filters, page: filters.page + 1 };
        queryClient.prefetchQuery({
            queryFn: ({ signal }) => getProjects(newFilters, signal),
            queryKey: ["projects", newFilters],
        });
    }

    if (filters.page && filters.page > 1) {
        const newFilters = { ...filters, page: filters.page - 1 };
        queryClient.prefetchQuery({
            queryFn: ({ signal }) => getProjects(newFilters, signal),
            queryKey: ["projects", newFilters],
        });
    }

    return {
        isLoading,
        data: data?.projects ?? [],
        totalSize: data?.totalProjects ?? 0,
        error,
    };
}

export default useProjects;
