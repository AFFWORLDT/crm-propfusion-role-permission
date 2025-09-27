import { useMyPermissions } from "../hooks/useHasPermission";
import PageNotFound from "../pages/PageNotFound";
import { useEffect, useState } from "react";

/**
 * RoleGuard component for protecting routes based on permissions
 * @param {Object} props
 * @param {string|string[]} props.permissions - Required permission(s) to access the route
 * @param {boolean} props.requireAll - If true, user must have ALL permissions. If false, user needs ANY permission
 * @param {React.ReactNode} props.children - Components to render if user has permission
 * @param {React.ReactNode} props.fallback - Component to render if user doesn't have permission (default: PageNotFound)
 * @param {boolean} props.showFallback - Whether to show fallback component or hide completely
 */
function RoleGuard({ 
    permissions, 
    requireAll = false, 
    children, 
    fallback = <PageNotFound />,
    showFallback = true 
}) {
    const { hasPermission, isLoading } = useMyPermissions();
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        if (isLoading) return;

        if (!permissions) {
            setHasAccess(true);
            return;
        }

        const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
        
        let access = false;
        if (requireAll) {
            // User must have ALL permissions
            access = permissionArray.every(permission => hasPermission(permission));
        } else {
            // User needs ANY permission
            access = permissionArray.some(permission => hasPermission(permission));
        }

        setHasAccess(access);
    }, [permissions, requireAll, hasPermission, isLoading]);

    if (isLoading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    if (!hasAccess) {
        return showFallback ? fallback : null;
    }

    return children;
}

export default RoleGuard;
