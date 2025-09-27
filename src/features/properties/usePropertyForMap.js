import { useQuery } from "@tanstack/react-query";
import {
    fetchPropertiesForMap,
    fetchDevelopersForMap,
    fetchProjectsForMap,
} from "../../services/apiProperties";
import { useSearchParams } from "react-router-dom";

export function usePropertyForMap() {
    const [searchParams] = useSearchParams();

    const filter = {
        
    };
    for (const [key, value] of searchParams.entries()) {
        if (value) {
            filter[key] = value;
        }
    }
    const { data, isLoading } = useQuery({
        queryKey: ["propertiesForMap", filter],
        queryFn: ({ signal }) => fetchPropertiesForMap(filter, signal),
        keepPreviousData: true,
    });
    return { data, isLoading };
}

export function useDeveloperForMap() {
    const [searchParams] = useSearchParams();

    const filter = {
        
    };
    for (const [key, value] of searchParams.entries()) {
        if (value) {
            filter[key] = value;
        }
    }
    const { data, isLoading } = useQuery({
        queryKey: ["developersForMap", filter],
        queryFn: ({ signal }) => fetchDevelopersForMap(filter, signal),
        keepPreviousData: true,
    });
    return { data, isLoading };
}

export function useProjectForMap() {
    const [searchParams] = useSearchParams();

    const filter = {
        
    };
    for (const [key, value] of searchParams.entries()) {
        if (value) {
            filter[key] = value;
        }
    }
    const { data, isLoading } = useQuery({
        queryKey: ["projectsForMap", filter],
        queryFn: ({ signal }) => fetchProjectsForMap(filter, signal),
        keepPreviousData: true,
    });
    return { data, isLoading };
}


