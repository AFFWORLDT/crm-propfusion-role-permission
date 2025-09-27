import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAllRentalAgreementPaymentReport,
} from "../../services/apiRentalAgreeMent";
import { useSearchParams } from "react-router-dom";

function        useGetallRentalAgreementPaymentReports() {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const filters = {
        page: 1,
        size: 10
    };

    for (const [key, val] of searchParams.entries()) {
        if (key === "page") {
            filters.page = Number(val) || 1;
            continue;
        }
        if (key === "size") {
            filters.size = Number(val) || 10;
            continue;
        }
        if (val) filters[key] = val;
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ["rental-agreement-payment-report", filters],
        queryFn: ({ signal }) => getAllRentalAgreementPaymentReport(filters, false, signal),
    });

    // Prefetch next page
    const currentPage = data?.pagination?.page || 1;
    const totalPages = data?.pagination?.total_pages || 1;

    if (currentPage < totalPages) {
        const nextPageFilters = { 
            ...filters, 
            page: currentPage + 1,
            size: filters.size 
        };
        queryClient.prefetchQuery({
            queryKey: ["rental-agreement-payment-report", nextPageFilters],
            queryFn: ({ signal }) => getAllRentalAgreementPaymentReport(nextPageFilters, false, signal),
        });
    }

    // Prefetch previous page
    if (currentPage > 1) {
        const prevPageFilters = { 
            ...filters, 
            page: currentPage - 1,
            size: filters.size 
        };
        queryClient.prefetchQuery({
            queryKey: ["rental-agreement-payment-report", prevPageFilters],
            queryFn: ({ signal }) => getAllRentalAgreementPaymentReport(prevPageFilters, false, signal),
        });
    }

    return {
        isLoading,
        error,
        properties: data?.properties ?? [],
        summary: data?.summary ?? {
            total_agreements: 0,
            total_properties: 0,
            total_revenue: 0,
            total_pending: 0,
            total_overdue: 0,
            total_collected: 0
        },
        pagination: data?.pagination ?? {
            total: 0,
            page: filters.page,
            size: filters.size,
            total_pages: 1
        },
        paymentAnalytics: data?.payment_analytics ??{}
    };
}

export default useGetallRentalAgreementPaymentReports;
