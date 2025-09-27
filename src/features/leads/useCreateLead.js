import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createLead } from "../../services/apiLeads";
// import { useNavigate } from "react-router-dom";

function useCreateLead() {
    // const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: addLead, isPending } = useMutation({
        mutationFn: createLead,
        onSuccess: (data) => {
            toast.success("New lead created!");
            queryClient.invalidateQueries({ queryKey: ["leads"] });
            queryClient.invalidateQueries({ queryKey: ["whatsappLeads"] });

            // navigate(`/leads/details/${data?.id}`);
        },
        onError: (err) => toast.error(err.message),
    });

    return { addLead, isPending };
}

export default useCreateLead;
