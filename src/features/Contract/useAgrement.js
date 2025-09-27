import { useInfiniteQuery } from '@tanstack/react-query';
import { getSaveData } from '../../services/apiContract'; 

export const useAgreements = (filters = {}) => {
  return useInfiniteQuery({
    queryKey: ['agreements', filters],
    queryFn: ({ pageParam = 1 }) => getSaveData({ 
      ...filters, 
      page: pageParam, 
      size: 10 
    }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data?.length < 10) return undefined;
      return pages.length + 1;
    },
    initialPageParam: 1
  });
};
