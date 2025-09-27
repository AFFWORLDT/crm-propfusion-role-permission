import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateTeam } from "../../../services/apiTeams";

function useUpdateTeam() {
    const queryClient = useQueryClient();

    const { mutate: changeTeam, isPending } = useMutation({
        mutationFn: ({ id, payload }) => updateTeam(id, payload),
        onSuccess: () => {
            toast.success("Team updated!");
            queryClient.invalidateQueries({ queryKey: ["teams"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { changeTeam, isPending };
}

export default useUpdateTeam;
