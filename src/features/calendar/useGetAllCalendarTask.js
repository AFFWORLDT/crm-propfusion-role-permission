import { useQuery } from "@tanstack/react-query";
import { getCalendarTasks } from "../../services/apiCalendar";

export function useCalendarTasks() {
    return useQuery({ 
        queryKey: ["events"],
        queryFn: getCalendarTasks,
    });
}

