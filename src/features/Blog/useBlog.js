import { useQuery } from "@tanstack/react-query";
import { getBlog, getBlogById } from "../../services/apiBlog";

function useBlog(page, size) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["blog", page, size], 
    queryFn: () => getBlog(page, size),
  });

  return { isLoading, data: data ?? [], error };
}

export default useBlog;

export const useGetBlogById=(id)=>{
  const { isLoading, data, error } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlogById(id),
    enabled: !!id, 
    initialData: undefined
  })
  return { isLoading, data: data ?? [], error };
}

