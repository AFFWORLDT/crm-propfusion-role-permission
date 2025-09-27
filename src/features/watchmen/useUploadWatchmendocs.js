import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadWatchmanDocs } from '../../services/apiwatchmen';
import { toast } from 'react-hot-toast';

export function useUploadWatchmanDocs() {
    const queryClient = useQueryClient();

    const {
        mutate: uploadDocs,
        isPending,
        error
    } = useMutation({
        mutationFn: ({ watchmanId, files }) => uploadWatchmanDocs(watchmanId, files),
        onSuccess: () => {
            // Invalidate and refetch tenant documents
            queryClient.invalidateQueries(['watchman', 'documents']);
            toast.success('Documents uploaded successfully');
        },
        onError: (error) => {
            console.error('Error uploading documents:', error);
            toast.error(error.message || 'Failed to upload documents');
        }
    });

    return { uploadDocs, isPending, error };
}
