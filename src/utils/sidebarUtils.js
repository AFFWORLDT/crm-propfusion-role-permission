/**
 * Check if a sidebar item should be visible based on permissions and features
 * @param {string|string[]} permissions - Required permissions
 * @param {boolean} featureFlag - Feature flag from backend
 * @param {Function} hasPermission - Function to check if user has permission
 * @param {boolean} requireAll - Whether user needs ALL permissions (default: false)
 * @returns {boolean} Whether the item should be visible
 */
export function shouldShowSidebarItem(permissions, featureFlag = false, hasPermission, requireAll = false) {
    // If no permissions specified, show based on feature flag only
    if (!permissions) {
        return featureFlag;
    }

    // Convert to array if single permission
    const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
    
    // Check permissions
    let hasRequiredPermissions = false;
    if (requireAll) {
        hasRequiredPermissions = permissionArray.every(permission => hasPermission(permission));
    } else {
        hasRequiredPermissions = permissionArray.some(permission => hasPermission(permission));
    }

    // Show if user has permissions OR feature flag is enabled
    return hasRequiredPermissions || featureFlag;
}

/**
 * Get sidebar item visibility status
 * @param {Object} config - Configuration object
 * @param {string|string[]} config.permissions - Required permissions
 * @param {boolean} config.featureFlag - Feature flag from backend
 * @param {Function} config.hasPermission - Function to check if user has permission
 * @param {boolean} config.requireAll - Whether user needs ALL permissions
 * @param {boolean} config.alwaysShow - Whether to always show the item
 * @returns {Object} Visibility status and reason
 */
export function getSidebarItemVisibility(config) {
    const { permissions, featureFlag = false, hasPermission, requireAll = false, alwaysShow = false } = config;

    if (alwaysShow) {
        return {
            visible: true,
            reason: 'always_show'
        };
    }

    if (!permissions) {
        return {
            visible: featureFlag,
            reason: featureFlag ? 'feature_flag' : 'no_permissions_no_feature'
        };
    }

    const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
    let hasRequiredPermissions = false;
    
    if (requireAll) {
        hasRequiredPermissions = permissionArray.every(permission => hasPermission(permission));
    } else {
        hasRequiredPermissions = permissionArray.some(permission => hasPermission(permission));
    }

    const visible = hasRequiredPermissions || featureFlag;
    
    return {
        visible,
        reason: visible 
            ? (hasRequiredPermissions ? 'permissions' : 'feature_flag')
            : 'no_permissions_no_feature'
    };
}

/**
 * Filter sidebar items based on permissions
 * @param {Array} items - Array of sidebar items
 * @param {Function} hasPermission - Function to check if user has permission
 * @returns {Array} Filtered items
 */
export function filterSidebarItems(items, hasPermission) {
    return items.filter(item => {
        const { permissions, featureFlag, requireAll, alwaysShow } = item;
        return shouldShowSidebarItem(permissions, featureFlag, hasPermission, requireAll) || alwaysShow;
    });
}

/**
 * Get accessible sidebar items count
 * @param {Array} items - Array of sidebar items
 * @param {Function} hasPermission - Function to check if user has permission
 * @returns {number} Count of accessible items
 */
export function getAccessibleItemsCount(items, hasPermission) {
    return filterSidebarItems(items, hasPermission).length;
}

/**
 * Check if user has any sidebar access
 * @param {Array} items - Array of sidebar items
 * @param {Function} hasPermission - Function to check if user has permission
 * @returns {boolean} Whether user has access to any sidebar items
 */
export function hasAnySidebarAccess(items, hasPermission) {
    return getAccessibleItemsCount(items, hasPermission) > 0;
}
