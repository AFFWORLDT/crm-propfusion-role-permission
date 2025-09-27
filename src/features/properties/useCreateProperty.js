import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProperty } from "../../services/apiProperties";
import toast from "react-hot-toast";
import useImagesStore from "../../store/imagesStore";

function useCreateProperty() {
    const queryClient = useQueryClient();
    const { clearAllImages } = useImagesStore();

    const { mutate: addProperty, isPending } = useMutation({
        mutationFn: ({ newProperty, ownerDocs, photos,video,permit_qr_code }) =>
            createProperty(newProperty, ownerDocs, photos,video,permit_qr_code),
        onSuccess: () => {
            toast.success("New property created!");
            queryClient.invalidateQueries({ queryKey: ["newProperties"] });
            localStorage.removeItem("bayut");
            localStorage.removeItem("customPortal");
            localStorage.removeItem("dubizzle");
            localStorage.removeItem("ownPortal");
            localStorage.removeItem("propertyFinder");
            localStorage.removeItem("propfusionPortal");
            localStorage.removeItem("price_on_application");
            localStorage.removeItem("propsearch");
            localStorage.removeItem("public_status");
            localStorage.removeItem("sold_out");
            clearAllImages();
        },
        onError: (err) => {
            toast.error(err.message);
            clearAllImages();
        },
        onSettled: () => {
            clearAllImages();
        },
    });

    return { addProperty, isPending };
}

export default useCreateProperty;
