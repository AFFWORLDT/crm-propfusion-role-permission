/**
 * Permission mapping for different routes and features
 * Maps route paths to required permissions
 */

export const ROUTE_PERMISSIONS = {
    // Dashboard
    "/dashboard": ["view_analytics", "view_kpi"],
    
    // Properties
    "/for-sell": ["manage_properties", "view_properties"],
    "/for-rent": ["manage_properties", "view_properties"],
    "/properties/map": ["view_properties"],
    "/properties/gallery": ["view_properties"],
    
    // New Projects
    "/new-projects": ["manage_projects", "view_projects"],
    
    // Buildings
    "/new-building": ["manage_buildings", "view_buildings"],
    
    // Leads
    "/leads": ["manage_leads", "view_leads"],
    "/leads/sell": ["view_leads"],
    "/leads/rent": ["view_leads"],
    "/leads/portal-calls": ["view_leads"],
    "/leads/whatsapp-leads": ["view_leads"],
    "/leads/add": ["create_leads"],
    "/leads/edit": ["update_leads"],
    
    // Bayut Leads
    "/bayut-leads": ["view_leads"],
    
    // Customers/Database
    "/database": ["manage_customers", "view_customers"],
    "/contacts": ["view_customers"],
    
    // Transactions
    "/transactions": ["manage_transactions", "view_transactions"],
    
    // Viewings
    "/viewings": ["manage_viewings", "view_viewings"],
    
    // Vehicles
    "/vehicles": ["manage_vehicles", "view_vehicles"],
    
    // Areas
    "/areas": ["manage_locations", "view_areas"],
    
    // Developers
    "/developers": ["manage_developers", "view_developers"],
    
    // Locations
    "/locations": ["manage_locations", "view_locations"],
    
    // Teams
    "/admin/teams": ["manage_teams", "view_teams"],
    "/admin/teams-tree": ["view_teams"],
    
    // Staff/Users
    "/admin/staff": ["manage_users", "view_users"],
    "/admin/requests": ["manage_support"],
    
    // Admin General
    "/admin/general": ["manage_settings"],
    "/admin/general/roles-permissions": ["manage_roles"],
    "/admin/general/manage-areas": ["manage_locations"],
    "/admin/general/manage-developers": ["manage_developers"],
    "/admin/general/manage-company": ["manage_settings"],
    "/admin/general/manage-calls": ["manage_settings"],
    "/admin/general/smtp-setting": ["manage_settings"],
    "/admin/general/lead-rotation": ["manage_settings"],
    "/admin/general/web-apis": ["manage_settings"],
    "/admin/general/mobile-apps": ["manage_settings"],
    "/admin/general/updates": ["manage_settings"],
    "/admin/general/request-feature": ["manage_support"],
    "/admin/general/resolve-request": ["manage_support"],
    "/admin/general/subscription": ["manage_settings"],
    "/admin/general/organisation-wallet": ["manage_settings"],
    "/admin/general/currency-converter": ["manage_settings"],
    
    // Integrations
    "/admin/integrations": ["manage_integrations", "view_integrations"],
    "/admin/integration": ["manage_integrations"],
    
    // Data Import
    "/admin/data-import": ["manage_system"],
    
    // Watermark
    "/admin/watermark": ["manage_settings"],
    "/admin/watermark-qr": ["manage_settings"],
    
    // Audience & Communication
    "/admin/audience": ["manage_customers"],
    "/admin/fusionmails": ["manage_emails"],
    "/admin/blog": ["manage_blogs", "view_blogs"],
    
    // Reports
    "/followup-report": ["view_reports"],
    "/new-projects-report": ["view_reports"],
    "/kpi-submissions": ["view_kpi"],
    
    // Notifications
    "/notifications": ["view_notifications"],
    
    // WhatsApp
    "/whatsapp-logs": ["view_whatsapp_logs"],
    "/whatsapp": ["send_whatsapp"],
    
    // Calendar
    "/calendar": ["manage_calendars"],
    "/gcalendar": ["manage_calendars"],
    "/hrcalendar": ["manage_calendars"],
    
    // Affiliate
    "/admin/affiliate": ["manage_agent", "basic_affiliate"],
    "/admin/affiliate-tree": ["manage_agent", "basic_affiliate"],
    "/admin/affiliate-wallet": ["manage_agent", "basic_affiliate"],
    
    // Games
    "/games": [], // No specific permission required
    
    // Profile
    "/profile": [], // No specific permission required
    
    // FAQ
    "/faq": ["view_faqs"],
    
    // Gemini Chat
    "/gemini-chat": [], // No specific permission required
};

/**
 * Sidebar navigation permissions
 * Maps sidebar items to required permissions
 */
export const SIDEBAR_PERMISSIONS = {
    dashboard: ["view_analytics", "view_kpi"],
    
    // Properties
    properties: ["manage_properties", "view_properties"],
    sell: ["manage_properties", "view_properties"],
    rent: ["manage_properties", "view_properties"],
    newProjects: ["manage_projects", "view_projects"],
    buildings: ["manage_buildings", "view_buildings"],
    
    // Leads
    leads: ["manage_leads", "view_leads"],
    bayutLeads: ["view_leads"],
    
    // Database
    database: ["manage_customers", "view_customers"],
    contacts: ["view_customers"],
    
    // Transactions
    transactions: ["manage_transactions", "view_transactions"],
    
    // Viewings
    viewings: ["manage_viewings", "view_viewings"],
    
    // Vehicles
    vehicles: ["manage_vehicles", "view_vehicles"],
    
    // Locations
    areas: ["manage_locations", "view_areas"],
    developers: ["manage_developers", "view_developers"],
    locations: ["manage_locations", "view_locations"],
    
    // Admin
    admin: ["manage_system", "manage_users", "manage_roles", "manage_settings"],
    staff: ["manage_users", "view_users"],
    teams: ["manage_teams", "view_teams"],
    integrations: ["manage_integrations", "view_integrations"],
    dataImport: ["manage_system"],
    watermark: ["manage_settings"],
    audience: ["manage_customers"],
    fusionmails: ["manage_emails"],
    blog: ["manage_blogs", "view_blogs"],
    
    // Reports
    reports: ["view_reports"],
    followupReport: ["view_reports"],
    kpiSubmissions: ["view_kpi"],
    
    // Communication
    notifications: ["view_notifications"],
    whatsappLogs: ["view_whatsapp_logs"],
    whatsapp: ["send_whatsapp"],
    feed: ["manage_agent"],
    
    // Calendar
    calendar: ["manage_calendars"],
    
    // Affiliate
    affiliate: ["manage_agent", "basic_affiliate"],
    
    // FAQ
    faq: ["view_faqs"],
};

/**
 * Feature permissions for conditional rendering
 */
export const FEATURE_PERMISSIONS = {
    // Property management
    canViewProperties: ["view_properties"],
    canManageProperties: ["manage_properties"],
    canCreateProperties: ["create_properties"],
    canUpdateProperties: ["update_properties"],
    canDeleteProperties: ["delete_properties"],
    canPublishProperties: ["publish_properties"],
    canUnpublishProperties: ["unpublish_properties"],
    
    // Lead management
    canViewLeads: ["view_leads", "view_all_leads"],
    canManageLeads: ["manage_leads"],
    canCreateLeads: ["create_leads"],
    canUpdateLeads: ["update_leads"],
    canDeleteLeads: ["delete_leads"],
    canAssignLeads: ["assign_leads"],
    
    // User management
    canViewUsers: ["view_users", "view_all_users"],
    canManageUsers: ["manage_users"],
    canCreateUsers: ["create_users"],
    canUpdateUsers: ["update_users"],
    canDeleteUsers: ["delete_users"],
    canAssignRoles: ["assign_roles"],
    
    // Team management
    canViewTeams: ["view_teams", "view_all_teams"],
    canManageTeams: ["manage_teams"],
    canCreateTeams: ["create_teams"],
    canUpdateTeams: ["update_teams"],
    canDeleteTeams: ["delete_teams"],
    canAssignTeamMembers: ["assign_team_members"],
    
    // Transaction management
    canViewTransactions: ["view_transactions", "view_all_transactions"],
    canManageTransactions: ["manage_transactions"],
    canCreateTransactions: ["create_transactions"],
    canUpdateTransactions: ["update_transactions"],
    canDeleteTransactions: ["delete_transactions"],
    canApproveTransactions: ["approve_transactions"],
    
    // Building management
    canViewBuildings: ["view_buildings", "view_all_buildings"],
    canManageBuildings: ["manage_buildings"],
    canCreateBuildings: ["create_buildings"],
    canUpdateBuildings: ["update_buildings"],
    canDeleteBuildings: ["delete_buildings"],
    
    // Project management
    canViewProjects: ["view_projects", "view_all_projects"],
    canManageProjects: ["manage_projects"],
    canCreateProjects: ["create_projects"],
    canUpdateProjects: ["update_projects"],
    canDeleteProjects: ["delete_projects"],
    
    // Vehicle management
    canViewVehicles: ["view_vehicles", "view_all_vehicles"],
    canManageVehicles: ["manage_vehicles"],
    canCreateVehicles: ["create_vehicles"],
    canUpdateVehicles: ["update_vehicles"],
    canDeleteVehicles: ["delete_vehicles"],
    
    // Location management
    canViewAreas: ["view_areas"],
    canManageAreas: ["manage_areas"],
    canCreateAreas: ["create_areas"],
    canUpdateAreas: ["update_areas"],
    canDeleteAreas: ["delete_areas"],
    
    canViewLocations: ["view_locations"],
    canManageLocations: ["manage_locations"],
    canCreateLocations: ["create_locations"],
    canUpdateLocations: ["update_locations"],
    canDeleteLocations: ["delete_locations"],
    
    // Developer management
    canViewDevelopers: ["view_developers"],
    canManageDevelopers: ["manage_developers"],
    canCreateDevelopers: ["create_developers"],
    canUpdateDevelopers: ["update_developers"],
    canDeleteDevelopers: ["delete_developers"],
    
    // Customer management
    canViewCustomers: ["view_customers", "view_all_customers"],
    canManageCustomers: ["manage_customers"],
    canCreateCustomers: ["create_customers"],
    canUpdateCustomers: ["update_customers"],
    canDeleteCustomers: ["delete_customers"],
    
    // Viewing management
    canViewViewings: ["view_viewings", "view_all_viewings"],
    canManageViewings: ["manage_viewings"],
    canCreateViewings: ["create_viewings"],
    canUpdateViewings: ["update_viewings"],
    canDeleteViewings: ["delete_viewings"],
    canScheduleViewings: ["schedule_viewings"],
    canCancelViewings: ["cancel_viewings"],
    
    // Blog management
    canViewBlogs: ["view_blogs"],
    canManageBlogs: ["manage_blogs"],
    canCreateBlogs: ["create_blogs"],
    canUpdateBlogs: ["update_blogs"],
    canDeleteBlogs: ["delete_blogs"],
    canPublishBlogs: ["publish_blogs"],
    
    // FAQ management
    canViewFaqs: ["view_faqs"],
    canManageFaqs: ["manage_faqs"],
    canCreateFaqs: ["create_faqs"],
    canUpdateFaqs: ["update_faqs"],
    canDeleteFaqs: ["delete_faqs"],
    
    // Role management
    canViewRoles: ["view_roles"],
    canManageRoles: ["manage_roles"],
    canCreateRoles: ["create_roles"],
    canUpdateRoles: ["update_roles"],
    canDeleteRoles: ["delete_roles"],
    
    // Classification management
    canViewClassifications: ["view_classifications"],
    canManageClassifications: ["manage_classifications"],
    canCreateClassifications: ["create_classifications"],
    canUpdateClassifications: ["update_classifications"],
    canDeleteClassifications: ["delete_classifications"],
    
    // Agency management
    canViewAgencies: ["view_agencies", "view_all_agencies"],
    canManageAgencies: ["manage_agencies"],
    canCreateAgencies: ["create_agencies"],
    canUpdateAgencies: ["update_agencies"],
    canDeleteAgencies: ["delete_agencies"],
    
    // Notification management
    canViewNotifications: ["view_notifications", "view_all_notifications"],
    canManageNotifications: ["manage_notifications"],
    canCreateNotifications: ["create_notifications"],
    canUpdateNotifications: ["update_notifications"],
    canDeleteNotifications: ["delete_notifications"],
    canSendNotifications: ["send_notifications"],
    
    // Email management
    canManageEmails: ["manage_emails"],
    canSendEmails: ["send_emails"],
    canViewEmailLogs: ["view_email_logs"],
    
    // WhatsApp management
    canManageWhatsapp: ["manage_whatsapp"],
    canSendWhatsapp: ["send_whatsapp"],
    canViewWhatsappLogs: ["view_whatsapp_logs"],
    
    // Integration management
    canViewIntegrations: ["view_integrations"],
    canManageIntegrations: ["manage_integrations"],
    canConfigureIntegrations: ["configure_integrations"],
    
    // Support management
    canManageSupport: ["manage_support"],
    canViewTickets: ["view_tickets"],
    canCreateTickets: ["create_tickets"],
    canUpdateTickets: ["update_tickets"],
    canDeleteTickets: ["delete_tickets"],
    
    // System management
    canManageSystem: ["manage_system"],
    canViewLogs: ["view_logs"],
    canBackupData: ["backup_data"],
    canRestoreData: ["restore_data"],
    
    // Analytics and Reports
    canViewAnalytics: ["view_analytics"],
    canViewReports: ["view_reports", "view_all_reports"],
    canExportReports: ["export_reports"],
    canViewKpi: ["view_kpi", "view_all_kpi"],
    
    // Calendar management
    canManageCalendars: ["manage_calendars"],
    
    // Agent management
    canManageAgent: ["manage_agent"],
    
    // Settings management
    canManageSettings: ["manage_settings"],
    
    // Super access
    hasSuperAccess: ["super_access"],
};

/**
 * Get permissions required for a route
 * @param {string} routePath - The route path
 * @returns {string[]} Array of required permissions
 */
export function getRoutePermissions(routePath) {
    // Find exact match first
    if (ROUTE_PERMISSIONS[routePath]) {
        return ROUTE_PERMISSIONS[routePath];
    }
    
    // Find partial match for nested routes
    for (const [route, permissions] of Object.entries(ROUTE_PERMISSIONS)) {
        if (routePath.startsWith(route + "/") || routePath.startsWith(route + "?")) {
            return permissions;
        }
    }
    
    return [];
}

/**
 * Get permissions required for a sidebar item
 * @param {string} itemKey - The sidebar item key
 * @returns {string[]} Array of required permissions
 */
export function getSidebarPermissions(itemKey) {
    return SIDEBAR_PERMISSIONS[itemKey] || [];
}

/**
 * Get permissions required for a feature
 * @param {string} featureKey - The feature key
 * @returns {string[]} Array of required permissions
 */
export function getFeaturePermissions(featureKey) {
    return FEATURE_PERMISSIONS[featureKey] || [];
}
