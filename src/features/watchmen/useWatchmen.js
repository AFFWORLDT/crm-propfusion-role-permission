import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  updateWatchman, deleteWatchman } from "../../services/apiwatchmen";

export function useCreateWatchman() {
    const queryClient = useQueryClient();

    const { mutate: createWatchman, isLoading, error } = useMutation({
        mutationFn: createWatchman,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["watchmen"] });
        },
    });

    return {
        createWatchman,
        isLoading,
        error
    };
}

export function useUpdateWatchman() {
    const queryClient = useQueryClient();

    const { mutate: updateWatchmanMutation, isLoading, error } = useMutation({
        mutationFn: ({ watchmanId, watchmanData }) => updateWatchman(watchmanId, watchmanData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["watchmen"] });
        },
    });

    return {
        updateWatchman: updateWatchmanMutation,
        isLoading,
        error
    };
}

export function useDeleteWatchman() {
    const queryClient = useQueryClient();

    const { mutate: deleteWatchmanMutation, isLoading, error } = useMutation({
        mutationFn: deleteWatchman,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["watchmen"] });
        },
    });

    return {
        deleteWatchman: deleteWatchmanMutation,
        isLoading,
        error
    };
} 