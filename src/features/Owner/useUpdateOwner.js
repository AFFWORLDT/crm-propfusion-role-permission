import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOwner } from '../../services/apiOwner';
import toast from 'react-hot-toast';

export default function useUpdateOwner() {
  const queryClient = useQueryClient();

  const { mutate: updateOwnerMutation, isPending } = useMutation({
    mutationFn: ({ id, data, file }) => updateOwner(id, data, file),
    onSuccess: () => {
      toast.success('Owner successfully updated');
      queryClient.invalidateQueries({ queryKey: ['owner'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update owner');
    },
  });

  return { updateOwnerMutation, isPending };
} 