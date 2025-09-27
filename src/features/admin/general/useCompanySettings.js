import { useQuery } from "@tanstack/react-query";
import { getCompanySettings } from "../../../services/apiCompany";

function useCompanySettings() {
    const { isLoading, data, error } = useQuery({
        queryFn: getCompanySettings,   
        queryKey: ["companySettings"],
    });

    return { isLoading, data, error };  
}
// 
export default useCompanySettings;
