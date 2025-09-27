import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createOwner, updateOwner as updateOwnerApi, getOwner as getOwnerApi } from '../../services/apiOwner';
import toast from 'react-hot-toast';

export default function useCreateOwner(id) {
  const queryClient = useQueryClient();

  // Updated useQuery syntax for v5
  const {
    data: ownerData,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['owners', id],
    queryFn: () => getOwnerApi(id),
    enabled: !!id,
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const { mutate: addOwner } = useMutation({
    mutationFn: ({data, avatarFile}) => createOwner(data, avatarFile),
    onSuccess: () => {
      toast.success('Owner successfully created');
      queryClient.invalidateQueries({ queryKey: ['owners'] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { mutate: updateOwner } = useMutation({
    mutationFn: ({id, data, avatarFile}) => updateOwnerApi(id, data, avatarFile),
    onSuccess: () => {
      toast.success('Owner successfully updated');
      queryClient.invalidateQueries({ queryKey: ['owners'] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return {
    addOwner,
    updateOwner,
    ownerData,
    isLoading,
    isError,
    error
  };
}