import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBuilding } from "../../services/apiBuilding";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export function useDeleteBuilding() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate: deleteBuildingMutation, isLoading: isDeleting } = useMutation({
        mutationFn: deleteBuilding,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["buildings"] });
            queryClient.invalidateQueries({ queryKey: ["building"] });
            toast.success("Building deleted successfully");
            navigate(-1);
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    return { deleteBuildingMutation, isDeleting };
}
