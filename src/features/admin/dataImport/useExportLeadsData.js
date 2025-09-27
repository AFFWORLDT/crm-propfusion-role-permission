import toast from "react-hot-toast";
import { exportLeads } from "../../../services/apiExcel";
import { useMutation } from "@tanstack/react-query";

export function useExportLeadsData() {
    const { mutate, isPending, error } = useMutation({
        mutationFn: exportLeads,
        onSuccess: () => {
            toast.success("Leads exported successfully!");
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    return { mutate, isPending, error };
}

export default useExportLeadsData;
