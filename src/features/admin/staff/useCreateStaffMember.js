import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createStaff } from "../../../services/apiStaff";

function useCreateStaffMember() {
    const queryClient = useQueryClient();

    const { mutate: addStaffMember, isPending } = useMutation({
        mutationFn: createStaff,
        onSuccess: () => {
            toast.success("New staff member created!");
            queryClient.invalidateQueries({ queryKey: ["staff"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { addStaffMember, isPending };
}

export default useCreateStaffMember;
