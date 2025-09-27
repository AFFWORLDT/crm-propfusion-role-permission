import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { saveOnboardingResponses } from "../../services/apiOnboarding";

function useSaveOnboardingResponses() {
    const { mutate: saveResponses, isPending } = useMutation({
        mutationFn: saveOnboardingResponses,
        onSuccess: () => toast.success("Responses saved!"),
        onError: (err) => toast.error(err.message),
    });

    return { saveResponses, isPending };
}

export default useSaveOnboardingResponses;
