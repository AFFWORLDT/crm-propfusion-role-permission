import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { downloadLeadsTemplate } from "../../../services/apiExcel";

export function useDownloadLeadsTemplate() {
    const { mutate, isLoading, error } = useMutation({
        mutationFn: () => downloadLeadsTemplate(),
        onSuccess: () => {
            toast.success("Template downloaded successfully!");
        },
        onError: (err) => {
            toast.error("Download failed: " + err.message);
        },
    });

    return { download: mutate, isLoading, error };
}
