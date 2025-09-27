import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTenant } from '../../services/apiTenants';
import { toast } from 'react-hot-toast';

export function useDeleteTenant() {
  const queryClient = useQueryClient();

  const { mutate: deleteMutation, isPending } = useMutation({
    mutationFn: (id) => deleteTenant(id),
    onSuccess: () => {
      toast.success('Tenant successfully deleted');
      queryClient.invalidateQueries({ queryKey: ['tenents'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete tenant');
    },
  });

  return { deleteTenant: deleteMutation, isPending };
} 