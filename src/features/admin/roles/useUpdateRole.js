import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRole } from "../../../services/apiRoles";
import toast from "react-hot-toast";

export function useUpdateRole() {
  const queryClient = useQueryClient();

  const { mutate: update, isLoading } = useMutation({
    mutationFn: ({roleId, roleData}) => updateRole(roleId, roleData),
    onSuccess: () => {
      toast.success("Role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roles-permissions"] });
    },
    onError: (err) => {
      toast.error(err.message || "Could not update role");
    },
  });

            return { update, isLoading };
}
