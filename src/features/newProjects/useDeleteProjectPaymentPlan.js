import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProjectPaymentPlan } from "../../services/apiNewProjects";
import { toast } from "react-hot-toast";

export function useDeleteProjectPaymentPlan() {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deletePaymentPlan } = useMutation({
    mutationFn: ({ projectId, paymentPlanId }) => 
      deleteProjectPaymentPlan(projectId, paymentPlanId),
    onSuccess: () => {
      toast.success("Payment plan successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["projectPaymentPlans"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });

    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete payment plan");
    },
  });

  return { isDeleting, deletePaymentPlan };
}
