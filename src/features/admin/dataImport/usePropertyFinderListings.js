import { useMutation } from "@tanstack/react-query";
import { getPropertyFinderListings } from "../../../services/apiDataImport";
import toast from "react-hot-toast";
import { SelectAreaOrDeveloper } from "../../../services/SelectAreaOrDeveloper";

export function usePropertyFinderListings() {
    const { mutate: fetchPropertyFinderListings, isPending } = useMutation({
        mutationFn: getPropertyFinderListings,
        onSuccess: () =>
            toast.success("Successfully fetched Property Finder listings!"),
        onError: (err) => toast.error(err.message),
    });

    return { fetchPropertyFinderListings, isPending };
}

export function AddAreeaTanStack() {
    const { mutate: areaResponse, isPending } = useMutation({
        mutationFn: SelectAreaOrDeveloper,
        onSuccess: () => toast.success("Successfully added!"),
        onError: (err) => toast.error(err.message),
    });
    return { areaResponse, isPending };
}
