import { useQuery } from "@tanstack/react-query";
import { searchProperties } from "../../services/apiProperties";

export default function usePropertySearch(searchTerm, enabled = true) {
    const {
        data,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ["properties", "search", searchTerm],
        queryFn: ({ signal }) => searchProperties(searchTerm, signal),
        enabled: enabled && searchTerm?.length >= 2, // Only search when there are at least 2 characters
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
    });

    // Format the data for react-select
    const formattedData = data?.properties?.map(property => ({
        value: property.id,
        label: property.name || property.title || `Property ${property.id}`,
        // Only include safe properties that can be rendered
        id: property.id,
        name: property.name,
        title: property.title,
        // Format location as a string instead of object
        location: property.location ? 
            (typeof property.location === 'string' ? property.location : 
             `${property.location.city || ''}${property.location.community ? ', ' + property.location.community : ''}${property.location.sub_community ? ', ' + property.location.sub_community : ''}`.trim()) 
            : '',
        images: property.images,
        // Add other safe properties as needed
        price: property.price,
        type: property.type,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        // Store the full location object separately if needed
        locationData: property.location
    })) || [];

    return {
        properties: formattedData,
        isLoading,
        error,
        refetch,
        totalCount: data?.totalProperties || 0
    };
}
