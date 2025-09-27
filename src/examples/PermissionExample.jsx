import React from 'react';
import { usePermissionCheck, useManagePermission } from '../hooks/usePermissionCheck';
import { usePermissionBasedQuery } from '../hooks/usePermissionBasedQuery';
import { PermissionBasedComponent, withPermissions } from '../components/PermissionBasedComponent';
import RoleGuard from '../components/RoleGuard';

/**
 * Example component showing different ways to use the permission system
 */
function PermissionExample() {
    // Method 1: Using usePermissionCheck hook
    const { hasAccess, hasAnyPermission, hasAllPermissions } = usePermissionCheck([
        'view_properties',
        'manage_properties'
    ]);

    // Method 2: Using useManagePermission hook for specific resource
    const propertiesPermission = useManagePermission('properties');
    const leadsPermission = useManagePermission('leads');

    // Method 3: Using permission-based query
    const { data: propertiesData, isLoading, hasAccess: canViewProperties } = usePermissionBasedQuery(
        ['properties'],
        () => fetch('/api/properties').then(res => res.json()),
        ['view_properties']
    );

    return (
        <div>
            <h2>Permission System Examples</h2>
            
            {/* Method 1: Conditional rendering with usePermissionCheck */}
            {hasAccess && (
                <div>
                    <h3>You have access to properties!</h3>
                    <p>This content is only visible to users with property permissions.</p>
                </div>
            )}

            {/* Method 2: Using specific permission checks */}
            {propertiesPermission.canView && (
                <div>
                    <h3>Properties Management</h3>
                    {propertiesPermission.canCreate && (
                        <button>Create Property</button>
                    )}
                    {propertiesPermission.canUpdate && (
                        <button>Update Property</button>
                    )}
                    {propertiesPermission.canDelete && (
                        <button>Delete Property</button>
                    )}
                </div>
            )}

            {/* Method 3: Using PermissionBasedComponent */}
            <PermissionBasedComponent 
                permissions={['view_leads']}
                fallback={<div>You don't have permission to view leads</div>}
            >
                <div>
                    <h3>Leads Management</h3>
                    <p>This content is only visible to users with leads permissions.</p>
                </div>
            </PermissionBasedComponent>

            {/* Method 4: Using RoleGuard for entire sections */}
            <RoleGuard permissions={['manage_users']}>
                <div>
                    <h3>User Management</h3>
                    <p>This entire section is protected by RoleGuard.</p>
                </div>
            </RoleGuard>

            {/* Method 5: Permission-based API calls */}
            {canViewProperties && !isLoading && (
                <div>
                    <h3>Properties Data</h3>
                    <pre>{JSON.stringify(propertiesData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

/**
 * Example of a component wrapped with permissions using HOC
 */
const ProtectedUserList = withPermissions(
    function UserList() {
        return (
            <div>
                <h3>User List</h3>
                <p>This component is wrapped with permission checks.</p>
            </div>
        );
    },
    ['view_users', 'manage_users'],
    {
        fallback: <div>You don't have permission to view users</div>
    }
);

/**
 * Example of conditional API calls based on permissions
 */
function ConditionalApiExample() {
    const { createApiCall, hasAccess } = usePermissionBasedApi(['manage_properties']);

    const createProperty = createApiCall(async (propertyData) => {
        const response = await fetch('/api/properties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(propertyData)
        });
        return response.json();
    });

    const handleCreateProperty = async () => {
        try {
            if (!hasAccess) {
                alert('You do not have permission to create properties');
                return;
            }
            
            const result = await createProperty({ name: 'New Property' });
            console.log('Property created:', result);
        } catch (error) {
            console.error('Error creating property:', error);
        }
    };

    return (
        <div>
            <h3>Conditional API Example</h3>
            <button onClick={handleCreateProperty}>
                Create Property
            </button>
        </div>
    );
}

export default PermissionExample;
export { ProtectedUserList, ConditionalApiExample };
