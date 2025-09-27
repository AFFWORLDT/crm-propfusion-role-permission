import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOpenAiKey } from "../../../services/apiIntegrations";
import toast from "react-hot-toast";

function useCreateOpenAiKey() {
    const queryClient = useQueryClient();
    const { mutate: saveOpenAiKey, isPending } = useMutation({
        mutationFn: createOpenAiKey,
        onSuccess: () => {
            toast.success("OpenAI API key saved!");
            queryClient.invalidateQueries({ queryKey: ["openaiApiKey"] });
        },
        onError: (err) => toast.error(err.message),
    });
    return { saveOpenAiKey, isPending };
}

export default useCreateOpenAiKey; 