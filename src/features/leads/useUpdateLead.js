import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateLead } from "../../services/apiLeads";

function useUpdateLead() {
    const queryClient = useQueryClient();

    const { mutate: changeLead, isPending } = useMutation({
        mutationFn: ({ id, payload }) => updateLead(id, payload),
        onSuccess: () => {
            toast.success("Lead updated!");
            queryClient.invalidateQueries({ queryKey: ["lead"] });
            queryClient.invalidateQueries({ queryKey: ["leads"] });
            queryClient.invalidateQueries({ queryKey: ["whatsappLeads"] });
            queryClient.invalidateQueries({ queryKey: ["portalCalls"] });
            queryClient.invalidateQueries({ queryKey: ["phoneView"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { changeLead, isPending };
}

export default useUpdateLead;
