import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignRole } from "../../../services/apiRoles";
import toast from "react-hot-toast";

export function useAssignRole() {
  const queryClient = useQueryClient();

  const { mutate: assignRoleToUser, isPending: isAssigning } = useMutation({
    mutationFn: ({ userId, roleId }) => assignRole(userId, roleId),
    onSuccess: () => {
      toast.success("Role assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (err) => {
      toast.error(err.message || "Could not assign role to user");
    },
  });

  return { assignRoleToUser, isAssigning };
}
