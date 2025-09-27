import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMetaAdForm } from "../../../services/apiMetaAds";
import toast from "react-hot-toast";
function useCreateMetaAdForm() {
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: createMetaAdForm,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["metaAdForm"] });
        },
        onError: (error) => {
            console.log(error,'error');
        },
    });

    return { mutate, isPending };
}

export default useCreateMetaAdForm;