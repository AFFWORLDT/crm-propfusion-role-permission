import { useQuery } from '@tanstack/react-query';
import { getSimplifiedTenantLists } from '../../services/apiTenants';
import { useSearchParams } from 'react-router-dom';

export const useSimplifiedTenantLists = (fetchAll = false) => {
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

    const {
        data,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['simplifiedTenantLists', filters, fetchAll],
        queryFn: () => getSimplifiedTenantLists(filters, fetchAll),
    });

    return {
        tenants: data?.tenants || [],
        totalProperties: data?.total || 0,
        loading: isLoading,
        error: error?.message,
        refetch
    };
};
