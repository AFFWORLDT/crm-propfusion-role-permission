import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
    bulkAssignedAreas,
    bulkAssignedCommunity,
} from "../../services/apiAreas";

function useAssignBulkAgentToArea() {
    const queryClient = useQueryClient();

    const { mutate: assignAgents, isPending } = useMutation({
        mutationFn: ({ area_ids, new_agent_id }) =>
            bulkAssignedAreas({ area_ids, new_agent_id }),
        onSuccess: () => {
            toast.success("Agents assigned successfully!");
            queryClient.invalidateQueries({ queryKey: ["areas"] });
            queryClient.invalidateQueries({ queryKey: ["areasWithoutCount"] });
            queryClient.invalidateQueries({ queryKey: ["infiniteAreas"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { assignAgents, isPending };
}

export default useAssignBulkAgentToArea;

export function useAssignBulkAgentToCommunity() {
    const queryClient = useQueryClient();

    const { mutate: assignAgents, isPending } = useMutation({
        mutationFn: ({ name, payload }) => bulkAssignedCommunity(name, payload),
        onSuccess: () => {
            toast.success("Agents assigned successfully!");
            queryClient.invalidateQueries({ queryKey: ["areas"] });
            queryClient.invalidateQueries({ queryKey: ["areasWithoutCount"] });
            queryClient.invalidateQueries({ queryKey: ["infiniteAreas"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { assignAgents, isPending };
}
