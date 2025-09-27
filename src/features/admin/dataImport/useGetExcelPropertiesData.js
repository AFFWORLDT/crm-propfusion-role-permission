import { useMutation } from "@tanstack/react-query";
import { getExportExcelProperties } from "../../../services/apiExcel";
import toast from "react-hot-toast";

export function useGetExcelPropertiesData() {
    const { mutate, isPending, error } = useMutation({
        mutationFn: getExportExcelProperties,
        onSuccess: () => {
            toast.success("Successfully fetched!");
        },
        onError: (err) => {
            console.log(err);
            
            toast.error(err.message);
        },
    });

    return { mutate, isPending, error };
}
