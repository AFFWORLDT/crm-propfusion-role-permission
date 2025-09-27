import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createFollowUp } from "../../services/apiFollowUps";

function useCreateFollowUp() {
    const queryClient = useQueryClient();

    const { mutate: addFollowUp, isPending } = useMutation({
        mutationFn: createFollowUp,
        onSuccess: () => {
            toast.success("New follow up created!");
            queryClient.invalidateQueries({ queryKey: ["followUps"] });
            queryClient.invalidateQueries({ queryKey: ["leads"] });
            queryClient.invalidateQueries({ queryKey: ["whatsappLeads"] });
            queryClient.invalidateQueries({ queryKey: ["lead-logs"] });
            queryClient.invalidateQueries({ queryKey: ["lead"] });
            // queryClient.invalidateQueries({ queryKey: ["stages"] });
            // queryClient.invalidateQueries({ queryKey: ["groups"] });
            // queryClient.invalidateQueries({ queryKey: ["tags"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { addFollowUp, isPending };
}

export default useCreateFollowUp;
