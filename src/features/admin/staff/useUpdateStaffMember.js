import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateStaff } from "../../../services/apiStaff";

function useUpdateStaffMember() {
    const queryClient = useQueryClient();

    const { mutate: updateStaffMember, isPending } = useMutation({
        mutationFn: ({ id, payload }) => updateStaff(id, payload),
        onSuccess: () => {
            toast.success("Staff member updated!");
            queryClient.invalidateQueries({ queryKey: ["staff"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { updateStaffMember, isPending };
}

export default useUpdateStaffMember;
