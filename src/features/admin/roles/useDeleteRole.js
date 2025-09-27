import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRole } from "../../../services/apiRoles";
import toast from "react-hot-toast";

export function useDeleteRole() {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deleteRoleMutation } = useMutation({
    mutationFn: (roleId) => deleteRole(roleId),
    onSuccess: () => {
      toast.success("Role successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (err) => {
      toast.error(err.message || "Could not delete role");
    },
  });

  return { isDeleting, deleteRoleMutation };
}
