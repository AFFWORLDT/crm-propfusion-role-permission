import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { uploadVehicleImage } from "../../services/apiVehicles";

function useUploadVehiclePhoto() {
    const queryClient = useQueryClient();

    const { mutate: uploadPhoto, isPending } = useMutation({
        mutationFn: ({ vehicleId, file }) => uploadVehicleImage(vehicleId, file),
        onSuccess: (data) => {
            toast.success("Photo uploaded successfully!");
            queryClient.invalidateQueries({ queryKey: ["vehicle", data.vehicleId] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { uploadPhoto, isPending };
}

export default useUploadVehiclePhoto; 