import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGeminiKey } from "../../../services/apiIntegrations";
import toast from "react-hot-toast";

function useCreateGeminiKey() {
    const queryClient = useQueryClient();
    const { mutate: saveGeminiKey, isPending } = useMutation({
        mutationFn: createGeminiKey,
        onSuccess: () => {
            toast.success("Gemini API key saved!");
            queryClient.invalidateQueries({ queryKey: ["geminiApiKey"] });
        },
        onError: (err) => toast.error(err.message),
    });
    return { saveGeminiKey, isPending };
}

export default useCreateGeminiKey; 