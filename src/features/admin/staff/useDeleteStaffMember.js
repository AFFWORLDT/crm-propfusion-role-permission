import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteStaff } from "../../../services/apiStaff";

function useDeleteStaffMember() {
    const queryClient = useQueryClient();

    const { mutate: deleteStaffMember, isPending } = useMutation({
        mutationFn: deleteStaff,
        onSuccess: () => {
            toast.success("Staff member deleted!");
            queryClient.invalidateQueries({ queryKey: ["staff"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { deleteStaffMember, isPending };
}

export default useDeleteStaffMember;
