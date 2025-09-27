import { useMutation } from "@tanstack/react-query";
import { generatePropertyContent } from "../../services/apiAi";
import toast from "react-hot-toast";

export function useCreatePropertyContent() {
    const {
        mutate: createContent,
        isPending,
        data: aiResponse,
    } = useMutation({
        mutationFn: (data) => generatePropertyContent(data),
        onSuccess: () => {
            toast.success("Property content generated successfully");
        },
        onError: (err) => {
            toast.error(err.message || "Failed to generate property content");
        },
    });

    return { createContent, isPending, aiResponse };
}
