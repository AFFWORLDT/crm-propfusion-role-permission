import { useMutation } from "@tanstack/react-query";
import { getPropertyExcelExample } from "../../../services/apiExcel";

export function useGetPropertyExcelExample() {
    const { mutate, isPending, error } = useMutation({
     
        mutationFn: () => getPropertyExcelExample(),
    });
    return {
        mutate,
        isPending,
        error,
    };
}
