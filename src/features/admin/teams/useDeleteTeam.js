import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteTeam } from "../../../services/apiTeams";

function useDeleteTeam() {
    const queryClient = useQueryClient();

    const { mutate: removeTeam, isPending } = useMutation({
        mutationFn: deleteTeam,
        onSuccess: () => {
            toast.success("Team deleted!");
            queryClient.invalidateQueries({ queryKey: ["teams"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { removeTeam, isPending };
}

export default useDeleteTeam;
