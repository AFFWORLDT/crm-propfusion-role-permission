# Role-Based Access Control (RBAC) System

This document describes the comprehensive role-based access control system implemented in the CRM application.

## Overview

The permission system provides:
- Route-level protection
- Component-level permission checks
- API call optimization based on permissions
- Sidebar and navigation filtering
- Caching and performance optimization

## Core Components

### 1. RoleGuard Component

A wrapper component that protects routes and components based on permissions.

```jsx
import RoleGuard from '../components/RoleGuard';

// Protect a single component
<RoleGuard permissions={['view_properties']}>
    <PropertyList />
</RoleGuard>

// Protect with multiple permissions (user needs ANY)
<RoleGuard permissions={['view_properties', 'manage_properties']}>
    <PropertyManagement />
</RoleGuard>

// Protect with multiple permissions (user needs ALL)
<RoleGuard permissions={['view_properties', 'manage_properties']} requireAll={true}>
    <AdvancedPropertyManagement />
</RoleGuard>
```

### 2. Permission Hooks

#### usePermissionCheck
Main hook for checking permissions.

```jsx
import { usePermissionCheck } from '../hooks/usePermissionCheck';

function MyComponent() {
    const { hasAccess, hasAnyPermission, hasAllPermissions, isLoading } = usePermissionCheck([
        'view_properties',
        'manage_properties'
    ]);

    if (isLoading) return <div>Loading...</div>;
    
    return (
        <div>
            {hasAccess && <div>You have access!</div>}
        </div>
    );
}
```

#### useManagePermission
Hook for checking management permissions for specific resources.

```jsx
import { useManagePermission } from '../hooks/usePermissionCheck';

function PropertyManagement() {
    const propertiesPermission = useManagePermission('properties');
    
    return (
        <div>
            {propertiesPermission.canView && <PropertyList />}
            {propertiesPermission.canCreate && <CreatePropertyButton />}
            {propertiesPermission.canUpdate && <UpdatePropertyButton />}
            {propertiesPermission.canDelete && <DeletePropertyButton />}
        </div>
    );
}
```

#### useAdminPermissions
Hook for checking admin-level permissions.

```jsx
import { useAdminPermissions } from '../hooks/usePermissionCheck';

function AdminPanel() {
    const adminPermissions = useAdminPermissions();
    
    return (
        <div>
            {adminPermissions.canManageSystem && <SystemSettings />}
            {adminPermissions.canManageUsers && <UserManagement />}
            {adminPermissions.canViewAnalytics && <Analytics />}
        </div>
    );
}
```

### 3. Permission-Based API Calls

#### usePermissionBasedQuery
Hook for making API calls only when user has required permissions.

```jsx
import { usePermissionBasedQuery } from '../hooks/usePermissionBasedQuery';

function PropertyList() {
    const { data, isLoading, hasAccess } = usePermissionBasedQuery(
        ['properties'],
        () => fetch('/api/properties').then(res => res.json()),
        ['view_properties']
    );

    if (!hasAccess) return <div>No permission to view properties</div>;
    
    return (
        <div>
            {isLoading ? 'Loading...' : JSON.stringify(data)}
        </div>
    );
}
```

#### usePermissionBasedMutation
Hook for mutations with permission checks.

```jsx
import { usePermissionBasedMutation } from '../hooks/usePermissionBasedMutation';

function CreateProperty() {
    const mutation = usePermissionBasedMutation(
        (propertyData) => fetch('/api/properties', {
            method: 'POST',
            body: JSON.stringify(propertyData)
        }).then(res => res.json()),
        ['create_properties']
    );

    const handleCreate = () => {
        if (!mutation.hasAccess) {
            alert('No permission to create properties');
            return;
        }
        mutation.mutate({ name: 'New Property' });
    };

    return (
        <button onClick={handleCreate} disabled={!mutation.hasAccess}>
            Create Property
        </button>
    );
}
```

### 4. Higher-Order Components

#### withPermissions
HOC for wrapping components with permission checks.

```jsx
import { withPermissions } from '../components/PermissionBasedComponent';

const ProtectedComponent = withPermissions(
    function MyComponent() {
        return <div>Protected content</div>;
    },
    ['view_properties'],
    {
        fallback: <div>No permission</div>,
        requireAll: false
    }
);
```

#### PermissionBasedComponent
Component for conditional rendering based on permissions.

```jsx
import { PermissionBasedComponent } from '../components/PermissionBasedComponent';

function MyPage() {
    return (
        <div>
            <h1>My Page</h1>
            <PermissionBasedComponent 
                permissions={['view_properties']}
                fallback={<div>You don't have permission to view properties</div>}
            >
                <PropertyList />
            </PermissionBasedComponent>
        </div>
    );
}
```

## Permission Mapping

### Route Permissions
Routes are mapped to required permissions in `src/utils/permissionMapping.js`:

```javascript
export const ROUTE_PERMISSIONS = {
    '/dashboard': ['view_analytics', 'view_kpi'],
    '/for-sell': ['manage_properties', 'view_properties'],
    '/leads': ['manage_leads', 'view_leads'],
    '/admin/staff': ['manage_users', 'view_users'],
    // ... more routes
};
```

### Sidebar Permissions
Sidebar items are mapped to permissions:

```javascript
export const SIDEBAR_PERMISSIONS = {
    dashboard: ['view_analytics', 'view_kpi'],
    properties: ['manage_properties', 'view_properties'],
    leads: ['manage_leads', 'view_leads'],
    // ... more items
};
```

### Feature Permissions
Features are mapped to specific permissions:

```javascript
export const FEATURE_PERMISSIONS = {
    canViewProperties: ['view_properties'],
    canManageProperties: ['manage_properties'],
    canCreateProperties: ['create_properties'],
    // ... more features
};
```

## Available Permissions

The system supports the following permission categories:

### Property Management
- `view_properties` - View property listings
- `manage_properties` - Full property management
- `create_properties` - Create new properties
- `update_properties` - Update existing properties
- `delete_properties` - Delete properties
- `publish_properties` - Publish properties
- `unpublish_properties` - Unpublish properties

### Lead Management
- `view_leads` - View lead listings
- `view_all_leads` - View all leads (including other users')
- `manage_leads` - Full lead management
- `create_leads` - Create new leads
- `update_leads` - Update existing leads
- `delete_leads` - Delete leads
- `assign_leads` - Assign leads to users

### User Management
- `view_users` - View user listings
- `view_all_users` - View all users
- `manage_users` - Full user management
- `create_users` - Create new users
- `update_users` - Update existing users
- `delete_users` - Delete users
- `assign_roles` - Assign roles to users

### Team Management
- `view_teams` - View team listings
- `view_all_teams` - View all teams
- `manage_teams` - Full team management
- `create_teams` - Create new teams
- `update_teams` - Update existing teams
- `delete_teams` - Delete teams
- `assign_team_members` - Assign members to teams

### Transaction Management
- `view_transactions` - View transaction listings
- `view_all_transactions` - View all transactions
- `manage_transactions` - Full transaction management
- `create_transactions` - Create new transactions
- `update_transactions` - Update existing transactions
- `delete_transactions` - Delete transactions
- `approve_transactions` - Approve transactions

### System Management
- `manage_system` - System administration
- `view_logs` - View system logs
- `backup_data` - Backup system data
- `restore_data` - Restore system data
- `super_access` - Super admin access

### Settings Management
- `manage_settings` - Manage system settings
- `manage_integrations` - Manage integrations
- `manage_support` - Manage support tickets
- `manage_agent` - Manage agent features

### Analytics and Reports
- `view_analytics` - View analytics dashboard
- `view_reports` - View reports
- `view_all_reports` - View all reports
- `export_reports` - Export reports
- `view_kpi` - View KPI data
- `view_all_kpi` - View all KPI data

## Usage Examples

### 1. Protecting Routes

```jsx
// In App.jsx
<Route
    path="/properties"
    element={
        <RoleGuard permissions={['view_properties']}>
            <PropertyList />
        </RoleGuard>
    }
/>
```

### 2. Conditional Sidebar Items

```jsx
// In CustomSideNav.jsx
{(propertiesPermission.canView || features.sell_list) && (
    <li>
        <NavLink to="/for-sell/new-list">
            <img src="/icons/for-sell.svg" alt="Sell Icon" />
            <span>Listings</span>
        </NavLink>
    </li>
)}
```

### 3. Conditional API Calls

```jsx
function PropertyList() {
    const { data, isLoading, hasAccess } = usePermissionBasedQuery(
        ['properties'],
        fetchProperties,
        ['view_properties']
    );

    if (!hasAccess) {
        return <div>No permission to view properties</div>;
    }

    return (
        <div>
            {isLoading ? 'Loading...' : <PropertyGrid data={data} />}
        </div>
    );
}
```

### 4. Conditional UI Elements

```jsx
function PropertyCard({ property }) {
    const propertiesPermission = useManagePermission('properties');
    
    return (
        <div className="property-card">
            <h3>{property.name}</h3>
            <p>{property.description}</p>
            
            {propertiesPermission.canUpdate && (
                <button onClick={() => editProperty(property.id)}>
                    Edit
                </button>
            )}
            
            {propertiesPermission.canDelete && (
                <button onClick={() => deleteProperty(property.id)}>
                    Delete
                </button>
            )}
        </div>
    );
}
```

## Performance Optimization

### Caching
- Permissions are cached in localStorage for 1 hour
- Cache is automatically cleared on logout
- Cache can be manually cleared using `clearCachedPermissions()`

### API Optimization
- API calls are only made when user has required permissions
- Unnecessary API calls are prevented
- Loading states are handled efficiently

### Component Optimization
- Permission checks are memoized
- Components only re-render when permissions change
- Fallback components are rendered efficiently

## Best Practices

1. **Always check permissions before making API calls**
2. **Use specific permissions rather than broad ones**
3. **Provide meaningful fallback messages**
4. **Cache permissions appropriately**
5. **Test permission scenarios thoroughly**
6. **Use TypeScript for better type safety**
7. **Document permission requirements clearly**

## Troubleshooting

### Common Issues

1. **Permission not working**: Check if permission is correctly mapped in `permissionMapping.js`
2. **API calls not being made**: Ensure user has required permissions
3. **Sidebar items not showing**: Check both feature flags and permissions
4. **Cache issues**: Clear localStorage and refresh

### Debug Tools

```jsx
// Check current permissions
const { userPermissions } = usePermissionCheck();
console.log('Current permissions:', userPermissions);

// Check specific permission
import { hasPermission } from '../services/apiSidebar';
console.log('Has view_properties:', hasPermission('view_properties'));
```

## Migration Guide

### From Feature Flags to Permissions

1. Replace feature flag checks with permission checks
2. Update route protection
3. Update component conditional rendering
4. Update API call conditions
5. Test thoroughly

### Example Migration

```jsx
// Before (feature flags)
{features.sell_list && <SellPropertyList />}

// After (permissions)
{(propertiesPermission.canView || features.sell_list) && <SellPropertyList />}
```

This permission system provides a robust, scalable, and maintainable way to manage access control throughout the application.
