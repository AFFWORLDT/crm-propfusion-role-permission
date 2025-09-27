import { useQuery } from "@tanstack/react-query";
import { getAllRentalAgreement } from "../../services/apiRentalAgreeMent";
import { useSearchParams } from "react-router-dom";

const useGetRentalAgreementList = (fetchAll = false) => {
    const [searchParams] = useSearchParams();
    const filters = {
    };

    for (const [key, val] of searchParams.entries()) {
        if (key === "page") {
            filters[key] = Number(val) || 1;
            continue;
        }
        if (val) filters[key] = val;
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ["rental-agreement-list"],
        queryFn: () => getAllRentalAgreement(filters, fetchAll),
    });

    return {
        total: data?.total || 0,
        page: data?.page || 1,
        size: data?.size || 10,
        total_pages: data?.total_pages || 1,
        agreements: data?.agreements || [],
        isLoading,
        error
    };
};

export default useGetRentalAgreementList;
