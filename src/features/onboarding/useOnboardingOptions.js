import { useQuery } from "@tanstack/react-query";
import { getOnboardingOptions } from "../../services/apiOnboarding";

function useOnboardingOptions() {
    const { isLoading, data, error } = useQuery({
        queryFn: getOnboardingOptions,
        queryKey: ["onboardingOptions"],
    });

    return {
        isLoading,
        data: data ?? {},
        error,
    };
}

export default useOnboardingOptions;
