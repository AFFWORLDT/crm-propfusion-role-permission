import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteVehicleDocument } from "../../services/apivehicles";

function useDeleteVehicleDocument() {
    const queryClient = useQueryClient();

    const { mutate: removeDocument, isPending } = useMutation({
        mutationFn: ({ vehicleId, documentUrl }) => 
            deleteVehicleDocument(vehicleId, documentUrl),
        onSuccess: (_, variables) => {
            toast.success("Document deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["vehicle", variables.vehicleId] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { removeDocument, isPending };
}

export default useDeleteVehicleDocument; 