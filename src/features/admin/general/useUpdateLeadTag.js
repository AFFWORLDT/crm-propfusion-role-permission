import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateTagForLead } from "../../../services/apiIntegrations";

function useUpdateLeadTag() {
    const queryClient = useQueryClient();

    const { mutate: updateLeadTag, isPending } = useMutation({
        mutationFn: ({ id, tag }) => updateTagForLead(id, tag),
        onSuccess: () => {
            toast.success("Lead updated!");
            queryClient.invalidateQueries({ queryKey: ["whatsapp_leads"] });
            queryClient.invalidateQueries({ queryKey: ["whatsappLeads"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { updateLeadTag, isPending };
}

export default useUpdateLeadTag;
