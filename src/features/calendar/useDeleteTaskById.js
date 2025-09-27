import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteCalendarTaskById } from "../../services/apiCalendar";

export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (taskId) => deleteCalendarTaskById(taskId),
        onSuccess: () => {
            toast.success("Task has been deleted successfully!");
            queryClient.invalidateQueries({
                queryKey: ["tasks"],
            });
            queryClient.invalidateQueries({
                queryKey: ["events"],
            });
        },
        onError: (error) => {
            console.error("Error deleting task:", error);
            toast.error("Error deleting task!");
        },
    });
}
