import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePermissionCheck } from "./usePermissionCheck";

/**
 * Custom hook for permission-based queries
 * Prevents API calls if user doesn't have required permissions
 * @param {string} queryKey - React Query key
 * @param {Function} queryFn - Query function
 * @param {string|string[]} permissions - Required permissions
 * @param {Object} options - Additional query options
 * @returns {Object} Query result
 */
export function usePermissionBasedQuery(queryKey, queryFn, permissions, options = {}) {
    const { hasAccess, isLoading: permissionLoading } = usePermissionCheck(permissions);
    
    const query = useQuery({
        queryKey,
        queryFn: hasAccess ? queryFn : () => Promise.resolve(null),
        enabled: hasAccess && !permissionLoading,
        ...options
    });

    return {
        ...query,
        hasAccess,
        isLoading: query.isLoading || permissionLoading
    };
}

/**
 * Custom hook for permission-based mutations
 * Prevents mutation execution if user doesn't have required permissions
 * @param {Function} mutationFn - Mutation function
 * @param {string|string[]} permissions - Required permissions
 * @param {Object} options - Additional mutation options
 * @returns {Object} Mutation result
 */
export function usePermissionBasedMutation(mutationFn, permissions, options = {}) {
    const { hasAccess, isLoading: permissionLoading } = usePermissionCheck(permissions);
    
    const mutation = useMutation({
        mutationFn: hasAccess ? mutationFn : () => Promise.reject(new Error("Insufficient permissions")),
        ...options
    });

    return {
        ...mutation,
        hasAccess,
        isLoading: mutation.isLoading || permissionLoading
    };
}

/**
 * Custom hook for conditional API calls based on permissions
 * @param {string|string[]} permissions - Required permissions
 * @param {Function} queryFn - Query function to execute if permissions are met
 * @param {Object} queryOptions - Additional query options
 * @returns {Object} Query result with permission status
 */
export function useConditionalQuery(permissions, queryFn, queryOptions = {}) {
    const { hasAccess, isLoading: permissionLoading } = usePermissionCheck(permissions);
    
    const query = useQuery({
        queryKey: [`conditional-${JSON.stringify(permissions)}`],
        queryFn: hasAccess ? queryFn : () => Promise.resolve(null),
        enabled: hasAccess && !permissionLoading,
        ...queryOptions
    });

    return {
        ...query,
        hasAccess,
        shouldExecute: hasAccess && !permissionLoading
    };
}

/**
 * Hook to check if a specific API call should be made based on permissions
 * @param {string|string[]} permissions - Required permissions
 * @returns {Object} Permission status for API calls
 */
export function useApiPermission(permissions) {
    const { hasAccess, isLoading } = usePermissionCheck(permissions);
    
    return {
        canCall: hasAccess && !isLoading,
        hasAccess,
        isLoading
    };
}
