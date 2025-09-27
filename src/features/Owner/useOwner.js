import { useQuery } from '@tanstack/react-query';
import { getOwners } from '../../services/apiOwner';

function useOwner(searchQuery = '') {
  const {
    isLoading,
    data: Owner,
    error: isError,
  } = useQuery({
    queryKey: ['owners', searchQuery],
    queryFn: () => getOwners(searchQuery),
  });

  return { isLoading, data: Owner, isError };
}

export default useOwner;