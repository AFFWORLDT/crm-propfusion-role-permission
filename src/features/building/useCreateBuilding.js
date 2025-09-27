import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createBuilding } from "../../services/apiBuilding";
// import { useSearchParams } from "react-router-dom";
import useImagesStore from "../../store/imagesStore";

function useCreateBuilding() {
    const queryClient = useQueryClient();
    // const [searchParams] = useSearchParams();
    const { clearAllImages } = useImagesStore();

    // const projectStatus = searchParams.get("status");

    const { mutate: addBuilding, isPending } = useMutation({
        mutationFn: ({ newProject, photos, floorPlanList }) =>
            createBuilding(newProject, photos, floorPlanList),
        onSuccess: () => {
            toast.success(
               
                 "New Building created!"
            );
            queryClient.invalidateQueries({ queryKey: ["building"] });
            localStorage.removeItem("bayut");
            localStorage.removeItem("customPortal");
            localStorage.removeItem("dubizzle");
            localStorage.removeItem("ownPortal");
            localStorage.removeItem("propertyFinder");
            localStorage.removeItem("propfusionPortal");
            localStorage.removeItem("price_on_application"); 
        },
        onError: (err) => {
            toast.error(err.message);
            clearAllImages();
        },
        onSettled: () => {
            clearAllImages();
        },
    });


    return { addBuilding, isPending };
}

export default useCreateBuilding;
