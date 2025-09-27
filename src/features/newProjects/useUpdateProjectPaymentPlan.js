import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProjectPaymentPlan as updateProjectPaymentPlanApi } from "../../services/apiNewProjects";
import { toast } from "react-hot-toast";

export function useUpdateProjectPaymentPlan() {
  const queryClient = useQueryClient();

  const { mutate: updatePaymentPlan, isPending } = useMutation({
    mutationFn: ({ projectId, paymentPlanId, paymentPlanData }) =>
      updateProjectPaymentPlanApi(projectId, paymentPlanId, paymentPlanData),
    onSuccess: () => {
      toast.success("Payment plan updated successfully");
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["paymentPlans"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update payment plan");
    },
  });

  return { updatePaymentPlan, isPending };
}
