import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateStaffPass } from "../../../services/apiStaff";

function useUpdatePass() {
    const { mutate: changePass, isPending } = useMutation({
        mutationFn: ({ id, payload }) => updateStaffPass(id, payload),
        onSuccess: () => {
            toast.success("Password updated!");
        },
        onError: (err) => toast.error(err.message),
    });

    return { changePass, isPending };
}

export default useUpdatePass;
