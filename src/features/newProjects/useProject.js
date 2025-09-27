import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { getProjects } from "../../services/apiNewProjects";

function useProject() {
    const { projectId } = useParams();
    const [searchParams] = useSearchParams();

    const filters = {
        project_id: projectId,
        status: searchParams.get("status") ?? "",
    };

    const { isLoading, data, error } = useQuery({
        queryFn: () => getProjects(filters),
        queryKey: ["project", filters],
    });

    return {
        isLoading,
        data: data?.projects ?? [],
        error,
    };
}

export default useProject;
