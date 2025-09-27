import { useMyPermissions } from "./useHasPermission";
import { useMemo } from "react";

/**
 * Custom hook for checking multiple permissions and managing access control
 * @param {string|string[]} permissions - Permission(s) to check
 * @param {boolean} requireAll - If true, user must have ALL permissions. If false, user needs ANY permission
 * @returns {Object} Permission check results and utilities
 */
export function usePermissionCheck(permissions, requireAll = false) {
    const { hasPermission, isLoading, permissions: userPermissions } = useMyPermissions();

    const permissionArray = useMemo(() => {
        if (!permissions) return [];
        return Array.isArray(permissions) ? permissions : [permissions];
    }, [permissions]);

    const hasAccess = useMemo(() => {
        if (isLoading) return false; // Don't show anything while loading
        if (!permissionArray.length) return false; // No permissions specified = no access

        if (requireAll) {
            return permissionArray.every(permission => hasPermission(permission));
        } else {
            return permissionArray.some(permission => hasPermission(permission));
        }
    }, [permissionArray, requireAll, hasPermission, isLoading]);

    const hasAnyPermission = useMemo(() => {
        if (isLoading) return false;
        if (!permissionArray.length) return false;
        return permissionArray.some(permission => hasPermission(permission));
    }, [permissionArray, hasPermission, isLoading]);

    const hasAllPermissions = useMemo(() => {
        if (isLoading) return false;
        if (!permissionArray.length) return false;
        return permissionArray.every(permission => hasPermission(permission));
    }, [permissionArray, hasPermission, isLoading]);

    const missingPermissions = useMemo(() => {
        if (isLoading || !permissionArray.length) return [];
        return permissionArray.filter(permission => !hasPermission(permission));
    }, [permissionArray, hasPermission, isLoading]);

    return {
        hasAccess,
        hasAnyPermission,
        hasAllPermissions,
        hasPermission,
        missingPermissions,
        isLoading,
        userPermissions
    };
}

/**
 * Hook for checking if user can manage a specific resource
 * @param {string} resource - Resource name (e.g., 'properties', 'leads', 'users')
 * @returns {Object} Management permissions for the resource
 */
export function useManagePermission(resource) {
    const managePermission = `manage_${resource}`;
    const viewPermission = `view_${resource}`;
    const createPermission = `create_${resource}`;
    const updatePermission = `update_${resource}`;
    const deletePermission = `delete_${resource}`;

    const { hasPermission, isLoading } = useMyPermissions();

    return {
        canManage: hasPermission(managePermission),
        canView: hasPermission(viewPermission),
        canCreate: hasPermission(createPermission),
        canUpdate: hasPermission(updatePermission),
        canDelete: hasPermission(deletePermission),
        isLoading
    };
}

/**
 * Hook for checking admin-level permissions
 * @returns {Object} Admin permissions
 */
export function useAdminPermissions() {
    const { hasPermission, isLoading } = useMyPermissions();

    return {
        canManageSystem: hasPermission("manage_system"),
        canManageUsers: hasPermission("manage_users"),
        canManageRoles: hasPermission("manage_roles"),
        canManageSettings: hasPermission("manage_settings"),
        canManageIntegrations: hasPermission("manage_integrations"),
        canManageSupport: hasPermission("manage_support"),
        canManageAgent: hasPermission("manage_agent"),
        canViewAnalytics: hasPermission("view_analytics"),
        canViewLogs: hasPermission("view_logs"),
        canBackupData: hasPermission("backup_data"),
        canRestoreData: hasPermission("restore_data"),
        hasSuperAccess: hasPermission("super_access"),
        isLoading
    };
}
