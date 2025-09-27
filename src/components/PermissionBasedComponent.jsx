import { usePermissionCheck } from "../hooks/usePermissionCheck";
import { useMemo } from "react";

/**
 * Higher-order component that wraps components with permission checks
 * @param {React.Component} WrappedComponent - Component to wrap
 * @param {string|string[]} permissions - Required permissions
 * @param {Object} options - Additional options
 * @returns {React.Component} Wrapped component with permission checks
 */
function withPermissions(WrappedComponent, permissions, options = {}) {
    const {
        requireAll = false,
        fallback = null,
        showFallback = true,
        ...otherOptions
    } = options;

    return function PermissionWrappedComponent(props) {
        const { hasAccess, isLoading } = usePermissionCheck(permissions, requireAll);

        const memoizedComponent = useMemo(() => {
            if (isLoading) {
                return <div className="loading-spinner">Loading...</div>;
            }

            if (!hasAccess) {
                return showFallback ? fallback : null;
            }

            return <WrappedComponent {...props} />;
        }, [hasAccess, isLoading, props]);

        return memoizedComponent;
    };
}

/**
 * Component that conditionally renders children based on permissions
 * @param {Object} props
 * @param {string|string[]} props.permissions - Required permissions
 * @param {boolean} props.requireAll - If true, user must have ALL permissions
 * @param {React.ReactNode} props.children - Components to render if user has permission
 * @param {React.ReactNode} props.fallback - Component to render if user doesn't have permission
 * @param {boolean} props.showFallback - Whether to show fallback component
 * @returns {React.ReactNode} Conditionally rendered content
 */
function PermissionBasedComponent({ 
    permissions, 
    requireAll = false, 
    children, 
    fallback = null,
    showFallback = true 
}) {
    const { hasAccess, isLoading } = usePermissionCheck(permissions, requireAll);

    if (isLoading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    if (!hasAccess) {
        return showFallback ? fallback : null;
    }

    return children;
}

/**
 * Hook to create permission-based API call functions
 * @param {string|string[]} permissions - Required permissions
 * @returns {Object} API call functions with permission checks
 */
export function usePermissionBasedApi(permissions) {
    const { hasAccess, isLoading } = usePermissionCheck(permissions);

    const createApiCall = (apiFunction) => {
        return async (...args) => {
            if (!hasAccess) {
                throw new Error("Insufficient permissions to perform this action");
            }
            return apiFunction(...args);
        };
    };

    const createConditionalApiCall = (apiFunction, fallbackValue = null) => {
        return async (...args) => {
            if (!hasAccess) {
                return fallbackValue;
            }
            return apiFunction(...args);
        };
    };

    return {
        hasAccess,
        isLoading,
        createApiCall,
        createConditionalApiCall
    };
}

export { withPermissions, PermissionBasedComponent };
export default PermissionBasedComponent;
