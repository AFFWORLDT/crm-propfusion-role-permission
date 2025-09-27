import { useMutation } from "@tanstack/react-query";
import { createPropertyReference } from "../../services/apiAi";
import toast from "react-hot-toast";

export function useAIPropertySuggestions() {
    const {
        mutate: createPropertySuggestions,
        isPending,
        data: suggestions,
    } = useMutation({
        mutationFn: ({
            leadId,
            prompt,
        }) => createPropertyReference({
            lead_id: leadId,  // Changed from leadId to lead_id
            prompt,
        }),
        onSuccess: () => {
            toast.success("Property suggestions generated successfully");
        },
        onError: (err) => {
            toast.error(err.message || "Failed to get property suggestions");
        },
    });

    return { createPropertySuggestions, isPending, suggestions };
} 