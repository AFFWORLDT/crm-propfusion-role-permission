import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateCalendarTaskById } from "../../services/apiCalendar";

export function useUpdateTask(onEditTask) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ taskId, updatedTask }) =>
            updateCalendarTaskById(taskId, updatedTask),
        onSuccess: (updatedData) => {
            onEditTask(updatedData);
            toast.success("Task has been updated successfully!");
            queryClient.invalidateQueries({
                queryKey: ["events"],
            });
            queryClient.invalidateQueries({
                queryKey: ["task", updatedData.id],
            });
        },
        onError: (error) => {
            console.error("Error updating task:", error);
            toast.error("Error updating task!");
        },
    });
}
