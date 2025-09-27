import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { saveContractInfo } from "../../services/apiContract"; 

function useSaveTanance() {
    const queryClient = useQueryClient();

    const { mutate: saveTanance, isPending } = useMutation({
        mutationFn: saveContractInfo,
        onSuccess: () => {
            toast.success("Contract saved successfully!");
            queryClient.invalidateQueries({ queryKey: ["tanance"] });
        },
        onError: (err) => {  
            console.error("Save contract error:", err);
            toast.error(err.message || "Failed to save contract");
        } 
    });

    return { saveTanance, isPending };
}

export default useSaveTanance;
