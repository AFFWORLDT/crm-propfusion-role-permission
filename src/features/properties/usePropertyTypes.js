import { useQuery } from "@tanstack/react-query";
import { getPropertyTypes } from "../../services/apiProperties";

function usePropertyTypes() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["propertyTypes"],
        queryFn: getPropertyTypes,
    });

    if (isLoading) return {};

    let propertyTypesOptions = {};
    Object.keys(data || {}).map((optGroupKey) => {
        propertyTypesOptions[optGroupKey] = [
            {
                value: "",
                label: "SELECT PROPERTY".toLowerCase(),
            },
            ...data[optGroupKey].map((item) => ({
                value: item.label,
                label: item.label.toLowerCase(),
            })),
        ];
    });

    return { propertyTypesOptions, error };
}

export default usePropertyTypes;
