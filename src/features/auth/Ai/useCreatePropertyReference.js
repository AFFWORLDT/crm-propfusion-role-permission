import { useMutation } from "@tanstack/react-query";
import { createPropertyReference } from "../../../services/apiAi";

export function useCreatePropertyReference() {
    const { mutate: createPropertyReferenceFn, isPending } = useMutation({
        mutationFn: (payload) => createPropertyReference(payload),
        onError: (err) => {
            console.error("Error creating property reference:", err);
        },
    });

    return { createPropertyReferenceFn, isPending };
}

export default useCreatePropertyReference;
