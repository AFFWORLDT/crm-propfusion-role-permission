import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createVehicle } from "../../services/apiVehicles";
import { useNavigate } from "react-router-dom";

function useCreateVehicle() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { mutate: addVehicle, isPending } = useMutation({
        mutationFn: ({ vehicleData, file }) => createVehicle(vehicleData, file),
        onSuccess: (data) => {
            toast.success("New vehicle created successfully!");
            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
            navigate(`/vehicles/details/${data?.id}`);
            localStorage.removeItem("single-image-storage");

        },
        onError: (err) => toast.error(err.message),
    });

    return { addVehicle, isPending };
}

export default useCreateVehicle; 