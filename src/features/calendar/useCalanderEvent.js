import { useQuery } from "@tanstack/react-query";
import { getCalendarEvent } from "../../services/apiCalendar";
import { useSearchParams } from "react-router-dom";
export function useCalendarEvent() {
    const [searchParams] = useSearchParams();
    const filters = {
        size: 1000,
    };
    for (const [key, val] of searchParams.entries()) {

        if (val) filters[key] = val;
    }
    const { isLoading, data } = useQuery({
        queryKey: ["ww",filters],
        queryFn: () => getCalendarEvent(filters),
    });
    return { isLoading, data };
}

