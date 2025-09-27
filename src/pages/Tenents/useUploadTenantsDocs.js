import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadTenantDocs } from '../../services/apiTenants';
import { toast } from 'react-hot-toast';

export function useUploadTenantsDocs() {
    const queryClient = useQueryClient();

    const {
        mutate: uploadDocs,
        isPending,
        error
    } = useMutation({
        mutationFn: ({ tenantId, files }) => uploadTenantDocs(tenantId, files),
        onSuccess: () => {
            // Invalidate and refetch tenant documents
            queryClient.invalidateQueries(['tenents']);
            queryClient.invalidateQueries(['tenant']);
            queryClient.invalidateQueries(['simplifiedTenantLists']);
            toast.success('Documents uploaded successfully');
        },
        onError: (error) => {
            console.error('Error uploading documents:', error);
            toast.error(error.message || 'Failed to upload documents');
        }
    });

    return { uploadDocs, isPending, error };
}
