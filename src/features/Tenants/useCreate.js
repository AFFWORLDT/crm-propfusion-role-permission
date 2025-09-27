import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTenents } from "../../services/apiTenants";
import { toast } from "react-hot-toast";

export function useCreateTenant() {
    const queryClient = useQueryClient();

    const { mutate: create, isPending } = useMutation({
        mutationFn: ({ data, file }) => createTenents(data, file),
        onSuccess: () => {
            toast.success("Tenant successfully created");
            queryClient.invalidateQueries({ queryKey: ["tenents"] });
            // window.location.reload();
        },
        onError: (err) => {
            toast.error(err.message || "Failed to create tenant");
        },
    });

    return { create, isPending };
}

// Add default export for backward compatibility
export default useCreateTenant;
