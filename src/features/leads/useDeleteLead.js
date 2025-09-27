import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteLead } from "../../services/apiLeads";

function useDeleteLead() {
    const queryClient = useQueryClient();

    const { mutate: removeLead, isPending } = useMutation({
        mutationFn: deleteLead,
        onSuccess: () => {
            toast.success("Lead deleted!");
            queryClient.invalidateQueries({ queryKey: ["leads"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { removeLead, isPending };
}

export default useDeleteLead;
