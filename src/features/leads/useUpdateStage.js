import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createFollowUpLead } from "../../services/apiLeads";

function useUpdateStage() {
    const queryClient = useQueryClient();

    const { mutate: changeLead, isPending } = useMutation({
        mutationFn: ({ payload }) => createFollowUpLead(payload),
        onSuccess: () => {
            toast.success("Lead updated!");
            queryClient.invalidateQueries({ queryKey: ["lead"] });
            queryClient.invalidateQueries({ queryKey: ["leads"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { changeLead, isPending };
}

export default useUpdateStage;
