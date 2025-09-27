import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateVehicle } from "../../services/apiVehicles";

function useUpdateVehicle() {
    const queryClient = useQueryClient();

    const { mutate: editVehicle, isPending } = useMutation({
        mutationFn: ({ vehicleId, vehicleData, file }) => 
            updateVehicle(vehicleId, vehicleData, file),
        onSuccess: () => {
            toast.success("Vehicle updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
            queryClient.invalidateQueries({ queryKey: ["vehicle"] });
            localStorage.removeItem("obdReportUrl");

        },
        onError: (err) => toast.error(err.message),
    });

    return { editVehicle, isPending };
}

export default useUpdateVehicle; 