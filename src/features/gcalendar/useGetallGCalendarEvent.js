import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getGCalendarEvents } from "../../services/apiGCalendar";

export const useGetallGCalendarEvent = (fetchAll = false) => {
    const [searchParams] = useSearchParams();
    const filters = {
        page: searchParams.get("page") ?? 1,
    };
    for (const [key, val] of searchParams.entries()) {
        if (key === "page") {
            filters[key] = Number(val) || 1;
            continue;
        }
        if (val) filters[key] = val;
    }
    const { data, isLoading, error } = useQuery({
        queryKey: ["events", filters],
        queryFn: () => getGCalendarEvents(filters, fetchAll),
    });
    return { data: data?.events ?? [], isLoading, error, total: data?.total ?? 0, };
};
