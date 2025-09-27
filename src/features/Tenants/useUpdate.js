import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTenant } from '../../services/apiTenants';
import { toast } from 'react-hot-toast';

export function useUpdateTenant() {
  const queryClient = useQueryClient();

  const { mutate: update, isPending } = useMutation({
    mutationFn: ({ id, data }) => updateTenant(id, data),
    onSuccess: () => {
      toast.success('Tenant successfully updated');
      queryClient.invalidateQueries({ queryKey: ['tenants', 'tenant'] });
      queryClient.invalidateQueries({ queryKey: ['tenant'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update tenant');  
    },
  });

  return { update, isPending };
} 