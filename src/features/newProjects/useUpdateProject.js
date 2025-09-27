import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateProject } from "../../services/apiNewProjects";
import useImagesStore from "../../store/imagesStore";

function useUpdateProject() {
    const queryClient = useQueryClient();
    const { clearAllImages } = useImagesStore();
    
    const { mutate: changeProject, isPending } = useMutation({
        mutationFn: ({ projectId, photos, updatedProject, newFloorPlans, Brochure, masterPlans, video, paymentPlanList,permit_qr_code }) =>
            updateProject(projectId, photos, updatedProject, newFloorPlans, Brochure, masterPlans, video, paymentPlanList,permit_qr_code),
        onSuccess: () => {
            toast.success("Project updated!");
            queryClient.invalidateQueries({ queryKey: ["project"] });
            clearAllImages();
            localStorage.removeItem("postHandover");
            localStorage.removeItem("propertyBooster");
            localStorage.removeItem("sold_out");
        },
        onError: (err) => {
            toast.error(err.message);
            clearAllImages();
        },
        onSettled: () => {
            clearAllImages();
        },  
    });

    return { changeProject, isPending };
}

export default useUpdateProject;
