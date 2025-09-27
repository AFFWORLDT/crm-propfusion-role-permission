import { useMutation } from "@tanstack/react-query";
import { deleteMetaAdForm } from "../../../services/apiMetaAds";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";


function useDeleteMetaAd() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formId) => deleteMetaAdForm(formId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["metaAds"] });
            toast.success("Meta Ad Form deleted successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
}

export default useDeleteMetaAd;