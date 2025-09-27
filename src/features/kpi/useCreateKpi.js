import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createKpiSubmission } from "../../services/apiKpi";
import toast from "react-hot-toast";

export function useCreateKpi() {
    const queryClient = useQueryClient();

    const {
        mutate: addKpi,
        isPending,
        error,
    } = useMutation({
        mutationFn: (data) => createKpiSubmission(data),
        onSuccess: (res) => {
            if (!res.success) {
                if (res.error.includes("already exists")) {
                    toast.error("KPI already submitted for today!");
                } else {
                    toast.error(res.error || "Failed to create KPI");
                }
                return;
            }
    
            toast.success("KPI created successfully!");
            queryClient.invalidateQueries({ queryKey: ["kpiLists"] });
    
        },
        onError: (error) => {
            toast.error(error?.message || "Failed to create KPI");
        },
    });

    return {
        addKpi,
        isPending,
        error,
    };
}
