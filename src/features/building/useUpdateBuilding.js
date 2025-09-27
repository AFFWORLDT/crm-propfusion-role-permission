import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateBuilding } from "../../services/apiBuilding";
import useImagesStore from "../../store/imagesStore";

function useUpdateBuilding() {
    const queryClient = useQueryClient();
    const { clearAllImages } = useImagesStore();

    const { mutate: updateBuildingMutation, isPending } = useMutation({
        mutationFn: ({ buildingId, updatedBuilding, photos, skipApiCall }) => {
            if (skipApiCall) {
                return Promise.resolve(); // Skip API call but still update local state
            }
            return updateBuilding(buildingId, updatedBuilding, photos);
        },
        onSuccess: () => {
            toast.success("Building updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["buildings"] });
            queryClient.invalidateQueries({ queryKey: ["building"] });
        },
        onError: (err) => {
            toast.error(err.message);
            clearAllImages();
        },
        onSettled: () => {
            clearAllImages();
        },
    });

    return { updateBuildingMutation, isPending };
}

export default useUpdateBuilding; 