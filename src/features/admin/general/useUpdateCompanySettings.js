import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateCompanySettings } from "../../../services/apiCompany";

function useUpdateCompanySettings() {
    const queryClient = useQueryClient();

    const { mutate: changeCompanySettings, isPending } = useMutation({
        mutationFn: updateCompanySettings,
        onSuccess: () => {
            toast.success("Company settings updated!");
            queryClient.invalidateQueries({ queryKey: ["companySettings"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { changeCompanySettings, isPending };
}

export default useUpdateCompanySettings;
