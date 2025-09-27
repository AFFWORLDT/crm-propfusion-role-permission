import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateAudience } from "../../services/apiAudience";

function useUpdateAudience() {
    const queryClient = useQueryClient();

    const { mutate: updatedata, isPendings } = useMutation({
        mutationFn: ({ id, payload }) => updateAudience(id, payload),
        onSuccess: () => {
            toast.success("Update Successfully!");
            queryClient.invalidateQueries({ queryKey: ["audience"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { updatedata, isPendings };
}

export default useUpdateAudience;
