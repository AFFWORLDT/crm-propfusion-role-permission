import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { bulkAssignedDeveloper } from "../../services/apiDevelopers";

function useAssignedBulkAgentToDeveloper() {
    const queryClient = useQueryClient();

    const { mutate: assignAgents, isPending } = useMutation({
        mutationFn: ({ developer_ids, new_agent_id }) =>
            bulkAssignedDeveloper({ developer_ids, new_agent_id }),
        onSuccess: () => {
            toast.success("Agents assigned successfully!");
            queryClient.invalidateQueries({ queryKey: ["developers"] });
            queryClient.invalidateQueries({
                queryKey: ["developersWithoutCount"],
            });
        },
        onError: (err) => toast.error(err.message),
    });

    return { assignAgents, isPending };
}

export default useAssignedBulkAgentToDeveloper;
