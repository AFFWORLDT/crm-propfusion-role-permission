import { useMutation } from "@tanstack/react-query";
import { deleteBlob } from "../../services/apiExtra";
import toast from "react-hot-toast";
import useDeleteImageStore from "../../store/deleteImageStore";

export function useDeleteImage() {
    const { clearAllImages } = useDeleteImageStore();
    const {
        mutate: deleteImage,
        isPending: isDeleting,
        error: deleteError,
        data: deleteData,
    } = useMutation({
        mutationFn: (blobUrl) => deleteBlob(blobUrl),
        onSuccess: () => {
            toast.success("File deleted successfully");
            clearAllImages();
        localStorage.removeItem("single-image-storage");

        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete file");
            clearAllImages();
        },
        onSettled: () => {
            clearAllImages();
        localStorage.removeItem("single-image-storage");

        },
    });

    return {
        deleteImage,
        isDeleting,
        deleteError,
        deleteData,
    };
}
