import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMetaAdForm } from "../../../services/apiMetaAds";
import toast from "react-hot-toast";

function useEditMetaAdForm() {
    const queryClient = useQueryClient();

    const { mutate: editMetaAdForm, isPending } = useMutation({
        mutationFn: ({ formId, formData }) => updateMetaAdForm(formId, formData),
        onSuccess: () => {
            // Invalidate the meta ads list query to trigger a refetch
            queryClient.invalidateQueries({ queryKey: ["metaAds"] });
            queryClient.invalidateQueries({ queryKey: ["meta-ad-form"] });
        },
    });

    return { editMetaAdForm, isPending };
}

export default useEditMetaAdForm; 