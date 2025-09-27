import { useQuery } from "@tanstack/react-query";
import { getCalendarTaskById } from "../../services/apiCalendar";

export const useCalendarTask = (taskId) => {
    return useQuery({
        queryKey: ["task", taskId],
        queryFn: () => getCalendarTaskById(taskId),
        enabled: !!taskId, 
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchInterval: 10000, 
    });
};
