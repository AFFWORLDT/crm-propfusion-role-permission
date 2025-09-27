import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { changePropertyRefId } from "../../services/apiProperties";

export default function useChangePropertyId() {
    const queryClient = useQueryClient();
    const { mutate: changePropertyId, isPending } = useMutation({
        mutationFn: ({ oldPropertyId, newPropertyId }) =>
            changePropertyRefId(oldPropertyId, newPropertyId),
        onSuccess: (data) => {
            toast.success(data?.message);
            queryClient.invalidateQueries({ queryKey: ["newProperty"] });
            queryClient.invalidateQueries({ queryKey: ["newProperties"] });
            queryClient.invalidateQueries({ queryKey: ["building"] });
            localStorage.removeItem("bayut");
            localStorage.removeItem("customPortal");
            localStorage.removeItem("dubizzle");
            localStorage.removeItem("ownPortal");
            localStorage.removeItem("propertyFinder");
            localStorage.removeItem("propfusionPortal");
            localStorage.removeItem("price_on_application");
            localStorage.removeItem("propsearch");
            localStorage.removeItem("public_status");
        },
        onError: () => {
            toast.error("Failed to change property ID");
        },
    });

    return { changePropertyId, isPending };
}
