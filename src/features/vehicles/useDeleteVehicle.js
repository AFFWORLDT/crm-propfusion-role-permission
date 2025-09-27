import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteVehicle } from "../../services/apiVehicles";
import { useNavigate } from "react-router-dom";

function useDeleteVehicle() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: removeVehicle, isPending } = useMutation({
        mutationFn: deleteVehicle,
        onSuccess: () => {
            toast.success("Vehicle deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
            navigate(-1);
        },
        onError: (err) => toast.error(err.message),
    });

    return { removeVehicle, isPending };
}

export default useDeleteVehicle;
