import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteKpiSubmission } from "../../services/apiKpi";
import toast from "react-hot-toast";

export function useDeleteKpi() {
    const queryClient = useQueryClient();

    const {
        mutate: deleteKpi,
        isPending,
        error,
    } = useMutation({
        mutationFn: (id) => deleteKpiSubmission(id),
        onSuccess: () => {
            toast.success("KPI deleted successfully!");
            queryClient.invalidateQueries({
                queryKey: ["kpiLists"],
            });
        },
        onError: (error) => {
            toast.error(error?.message || "Failed to delete KPI");
        },
    });

    return {
        deleteKpi,
        isPending,
        error,
    };
} 