import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { bulkAssignedOwner } from '../../services/apiTenants';

export default function useBulkAssignerAgentToOwner() {
  const queryClient = useQueryClient();

  const { mutate: bulkAssignOwner, isPending } = useMutation({
    mutationFn: ({ owner_ids, new_agent_id }) => bulkAssignedOwner({ owner_ids, new_agent_id }),
    onSuccess: () => {
      toast.success('Owners successfully reassigned');
      queryClient.invalidateQueries({ queryKey: ['owners'] });
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to reassign owners');
    },
  });

  return { bulkAssignOwner, isPending };
}