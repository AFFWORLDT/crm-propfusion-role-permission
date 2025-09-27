import { useQuery } from "@tanstack/react-query";

function useCountries() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["countries"],
        queryFn: getCountries,
    });

    return { data: data ?? [], isLoading, error };
}

async function getCountries() {
    const response = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,flags,idd"
    );
    const data = await response.json();

    if (!response.ok) {
        throw new Error("Couldn't fetch countries!");
    }

    return data;
}

export default useCountries;
