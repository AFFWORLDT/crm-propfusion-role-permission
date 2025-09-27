import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createTeam } from "../../../services/apiTeams";

function useCreateTeam() {
    const queryClient = useQueryClient();

    const { mutate: addTeam, isPending } = useMutation({
        mutationFn: createTeam,
        onSuccess: () => {
            toast.success("New team created!");
            queryClient.invalidateQueries({ queryKey: ["teams"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { addTeam, isPending };
}

export default useCreateTeam;
