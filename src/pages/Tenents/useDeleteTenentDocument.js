import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTenantDocument } from "../../services/apiTenants";
import { toast } from "react-hot-toast";
export function useDeleteTenantDocument() {
    const queryClient = useQueryClient();

    const { mutate: deleteDocument, isPending } = useMutation({
        mutationFn: ({ tenantId, documentUrl }) => deleteTenantDocument(tenantId, documentUrl),
        onSuccess: () => {
            queryClient.invalidateQueries(['tenents']);
            queryClient.invalidateQueries(['tenant']);
            queryClient.invalidateQueries(['simplifiedTenantLists']);
            toast.success("Document deleted successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return { deleteDocument, isPending };
}
