import { useMutation } from "@tanstack/react-query";
import { UpdateAgentIdBulk } from "../../../services/apiProperties";
import toast from "react-hot-toast";

export default function useUpdateBulkAgent() {
    const {
        mutate: updateBulkAgent,
        isPending: isPending,
        error: error,
    } = useMutation({
        mutationFn: ({ agentIdToReplace, agentIdToReplaceWith, type }) =>
            UpdateAgentIdBulk(agentIdToReplace, agentIdToReplaceWith, type),
        // onSuccess: () => toast.success("Agent Successfully Updated!"),
        onError: (err) => {
            toast.error(err.message), console.log(err);
        },
    });

    return { updateBulkAgent, isPending, error };
}
