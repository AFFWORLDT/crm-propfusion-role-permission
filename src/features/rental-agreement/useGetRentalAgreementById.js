import { useQuery } from "@tanstack/react-query";
import { getRentalAgreementById } from "../../services/apiRentalAgreeMent";

const useGetRentalAgreementById = (id) => {
    const { data: rentalAgreement, isLoading, error } = useQuery({
        queryKey: ["rental-agreement", id],
        queryFn: () => getRentalAgreementById(id),
        enabled: !!id,
    });

    return { rentalAgreement, isLoading, error };
};

export default useGetRentalAgreementById;
