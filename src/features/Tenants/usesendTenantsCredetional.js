import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendTenantsCredential } from "../../services/apiTenants";
import toast from "react-hot-toast";

export const useSendTenantsCredential = () => {
    const queryClient = useQueryClient();

    const { mutate: send, isPending } = useMutation({
        mutationFn: sendTenantsCredential,
        onSuccess: () => {

            toast.success("Credential Send SuccessFully on mail");
            queryClient.invalidateQueries({ queryKey: ["tenants"] });

        },
        onError: (err) => {
            toast.error("Error sending tenant credentials:", err);
        }
    });

    return { send, isPending };
};
