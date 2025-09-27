import { useQuery } from "@tanstack/react-query";
import { getApiUrl } from "../utils/getApiUrl";

function useLanguages() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["languages"],
        queryFn: getLanguages,
    });

    return { data: data ?? [], isLoading, error };
}

async function getLanguages() {
    const response = await fetch(
        `${getApiUrl()}/support/languages?size=200`
    );
    const data = await response.json();

    if (!response.ok) {
        throw new Error("Couldn't fetch languages!");
    }

    return data?.languages || [];
}

export default useLanguages;
