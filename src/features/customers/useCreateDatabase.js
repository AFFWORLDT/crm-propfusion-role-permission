import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDatabaseName } from "../../services/apiCustomer";
import { toast } from "react-hot-toast";

function useCreateDatabase() {
    const queryClient = useQueryClient();

    const { isLoading: isCreating, mutate: create } = useMutation({
        mutationFn: (databaseData) => createDatabaseName(databaseData),
        onSuccess: () => {
            toast.success("Database successfully created");
            queryClient.invalidateQueries({ queryKey: ["databases"] });
        },
        onError: (err) => {
            toast.error(err.message || "Failed to create database");
        },
    });

    return { isCreating, create };
}

export default useCreateDatabase;
