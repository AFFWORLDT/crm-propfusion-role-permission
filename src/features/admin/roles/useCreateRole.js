import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRole } from "../../../services/apiRoles";
import toast from "react-hot-toast";

export function useCreateRole() {
  const queryClient = useQueryClient();

  const { mutate: create, isPending } = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      toast.success("Role created successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roles-permissions"] });
    },
    onError: (err) => {
      toast.error(err.message || "Could not create role");
    },
  });

  return { create, isPending };
}
