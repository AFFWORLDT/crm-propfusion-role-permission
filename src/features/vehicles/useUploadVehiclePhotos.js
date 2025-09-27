import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { uploadVehiclePhotos } from "../../services/apivehicles";

function useUploadVehiclePhotos() {
    const queryClient = useQueryClient();

    const { mutate: uploadPhotos, isPending } = useMutation({
        mutationFn: ({ vehicleId, files }) => uploadVehiclePhotos(vehicleId, files),
        onSuccess: (data) => {
            toast.success("Photos uploaded successfully!");
            queryClient.invalidateQueries({ queryKey: ["vehicle", data.vehicleId] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { uploadPhotos, isPending };
}

export default useUploadVehiclePhotos; 