import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateKpiSubmission } from "../../services/apiKpi";
import toast from "react-hot-toast";

export function useUpdateKpi() {
    const queryClient = useQueryClient();

    const {
        mutate: updateKpi,
        isPending,
        error,
    } = useMutation({
        mutationFn: ({ id, data }) => updateKpiSubmission(id, data),
        onSuccess: () => {
            toast.success("KPI updated successfully!");
            queryClient.invalidateQueries({
                queryKey: ["kpiLists"],
            });
        },
        onError: (error) => {
            
            toast.error(error?.message || "Failed to update KPI");
        },
    });

    return {
        updateKpi,
        isPending,
        error,
    };
} 