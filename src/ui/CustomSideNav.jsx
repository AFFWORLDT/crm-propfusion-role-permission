import { useState, useEffect } from "react";
import styles from "./CustomSideNav.module.css";
import { Link, NavLink } from "react-router-dom";
import useAllDetails from "../features/all-details/useAllDetails";
import { getFeatures } from "../services/apiSidebar";
import { usePermissionCheck, useManagePermission } from "../hooks/usePermissionCheck";
import { useQuery } from "@tanstack/react-query";
import { getSidebarPermissions } from "../utils/permissionMapping";
// Removed unused sidebar utility imports
import { Phone } from "lucide-react";

function CustomSideNav() {
    const [isHamburgerActive, setIsHamburgerActive] = useState(false);
    
    // Use React Query for features
    const { data: features = {}, isLoading: featuresLoading } = useQuery({
        queryKey: ['features'],
        queryFn: getFeatures,
        staleTime: 0, // Always fetch fresh data
        cacheTime: 0, // Don't cache
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
    const { data } = useAllDetails();
    
    // Permission hooks
    const { hasPermission } = usePermissionCheck();
    const propertiesPermission = useManagePermission("properties");
    const leadsPermission = useManagePermission("leads");
    const projectsPermission = useManagePermission("projects");
    const buildingsPermission = useManagePermission("buildings");
    const vehiclesPermission = useManagePermission("vehicles");
    const customersPermission = useManagePermission("customers");
    const viewingsPermission = useManagePermission("viewings");
    const transactionsPermission = useManagePermission("transactions");
    const locationsPermission = useManagePermission("locations");
    const developersPermission = useManagePermission("developers");
    const teamsPermission = useManagePermission("teams");
    const usersPermission = useManagePermission("users");
    const rolesPermission = useManagePermission("roles");
    const integrationsPermission = useManagePermission("integrations");
    const blogsPermission = useManagePermission("blogs");
    const faqsPermission = useManagePermission("faqs");
    const notificationsPermission = useManagePermission("notifications");
    const whatsappPermission = useManagePermission("whatsapp");
    const systemPermission = useManagePermission("system");
    const settingsPermission = useManagePermission("settings");
    const supportPermission = useManagePermission("support");
    const agentPermission = useManagePermission("agent");
    const calendarsPermission = useManagePermission("calendars");
    const reportsPermission = useManagePermission("reports");
    const analyticsPermission = useManagePermission("analytics");

    // Features and permissions are now handled by React Query

    function handleToggleHamburger() {
        setIsHamburgerActive((prevState) => !prevState);
        document.documentElement.style.setProperty(
            "--side-nav-width",
            isHamburgerActive ? "10rem" : "25rem"
        );
    }

    // Debug: Log current permissions for troubleshooting
    useEffect(() => {
        if (features) {
            console.log('Current features:', features);
            console.log('leadsPermission:', leadsPermission);
            console.log('propertiesPermission:', propertiesPermission);
        }
    }, [features, leadsPermission, propertiesPermission]);

    // Get permissions from the useMyPermissions hook
    const { permissions: userPermissions, isLoading: permissionsLoading } = usePermissionCheck();

    if (featuresLoading || permissionsLoading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    // Always show sidebar, but items will be conditionally rendered based on permissions

    return (
        <>
            <aside
                className={`${styles.sideNav} ${isHamburgerActive ? styles.hamburgerActive : ""}`}
                style={{
                    background:
                        data?.company_settings?.sidebar_color_code || "#020079",
                }}
            >
                <div
                    onClick={handleToggleHamburger}
                    className={styles.toggleArrow}
                    style={{
                        background:
                            data?.company_settings?.sidebar_color_code ||
                            "#020079",
                    }}
                >
                    <img src="/icons/chevron-left.svg" alt="Toggle sidebar" />
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        flexDirection: "column",
                    }}
                >
                    <Link to="/">
                        <img
                            className={styles.logo}
                            src={data?.company_settings?.menu_logo_url}
                        />
                    </Link>
                </div>

                <nav>
                    <div className={styles.menuItems}>
                        <ul>
                            {/* Dashboard - show for all users */}
                            <li>
                                <NavLink to="/dashboard">
                                    <img
                                        src="/icons/dashboard.svg"
                                        alt="Dashboard Icon"
                                    />
                                    <span>Dashboard</span>
                                </NavLink>
                            </li>

                            {propertiesPermission.canView && (
                                <>
                                    <li>
                                        <NavLink to="/for-sell/new-list">
                                            <img
                                                src="/icons/for-sell.svg "
                                                alt="Sell Icon"
                                            />
                                            <span>Listings</span>
                                        </NavLink>
                                    </li>
                                    {projectsPermission.canView && (
                                        <li>
                                            <NavLink to="/new-projects/list?status=ACTIVE">
                                                <img
                                                    src="/icons/new-projects.svg "
                                                    alt="Sell Icon"
                                                />
                                                <span>New Projects</span>
                                            </NavLink>
                                        </li>
                                    )}
                                </>
                            )}

                            {(features?.new_buildings_list || buildingsPermission.canView) && (
                                <>
                                    <li>
                                        <NavLink to="new-building/list">
                                            <img
                                                src="/icons/building-icon.svg"
                                                alt="New Buildings Icon"
                                            />
                                            <span> Buildings</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="new-building/list-report">
                                            <img
                                                src="/icons/building-icon.svg"
                                                alt="New Buildings Icon"
                                            />
                                            <span> Buildings Reports List</span>
                                        </NavLink>
                                    </li>
                                </>
                            )}

                            {(developersPermission.canView || locationsPermission.canView) && (
                                <div className={styles.divider} />
                            )}

                            {locationsPermission.canView && (
                                <li>
                                    <NavLink to="/areas/list">
                                        <img
                                            src="/icons/areas.svg"
                                            alt="Areas Icon"
                                        />
                                        <span>Areas</span>
                                    </NavLink>
                                </li>
                            )}

                            {developersPermission.canView && (
                                <li>
                                    <NavLink to="/developers/list">
                                        <img
                                            src="/icons/developers.svg"
                                            alt="Developers Icon"
                                        />
                                        <span>Developers</span>
                                    </NavLink>
                                </li>
                            )}

                            {(leadsPermission.canView || leadsPermission.canManage) && (
                                <div className={styles.divider} />
                            )}

                            {(leadsPermission.canView || leadsPermission.canManage) && (
                                <li>
                                    <NavLink to="/leads">
                                        <img
                                            src="/icons/dollar-lead-icon.svg"
                                            alt="Leads Icon"
                                        />
                                        <span>Leads</span>
                                    </NavLink>
                                </li>
                            )}

                            {/*
                            <li>
                                <NavLink to="/upcoming-followups">
                                    <img
                                        src="/icons/calendar-white.svg"
                                        alt="Upcoming Followups Icon"
                                        style={{
                                            filter: "brightness(0) invert(1)",
                                        }}
                                    />
                                    <span>Upcoming Followups</span>
                                </NavLink>
                            </li>
                            */}

                            {(leadsPermission.canView || leadsPermission.canManage) && (
                                <li>
                                    <NavLink to="/leads/portal-calls">
                                        <Phone size={15} />
                                        <span>Portal Leads</span>
                                    </NavLink>
                                </li>
                            )}

                            {(hasPermission("view_contracts") || customersPermission.canView || hasPermission("view_rental_agreements")) && (
                                <div className={styles.divider} />
                            )}

                            {hasPermission("view_contracts") && (
                                <li>
                                    <NavLink to="/contract/new-contract">
                                        <img
                                            src="/icons/handshake.svg"
                                            alt="Management Icon"
                                        />
                                        <span>Contract</span>
                                    </NavLink>
                                </li>
                            )}

                            {customersPermission.canView && (
                                <li>
                                    <NavLink to="/for-owner/new-list">
                                        <img
                                            src="/icons/real-estate-owner.svg"
                                            alt="Management Icon"
                                        />
                                        <span>Investors</span>
                                    </NavLink>
                                </li>
                            )}

                            {customersPermission.canView && (
                                <li>
                                    <NavLink to="/for-tenants/new-list">
                                        <img
                                            src="/icons/household-family-inhabitants-tenants.svg"
                                            alt="Management Icon"
                                        />
                                        <span>Tenants</span>
                                    </NavLink>
                                </li>
                            )}

                            {hasPermission("view_rental_agreements") && (
                                <>
                                    <li>
                                        <NavLink to="/rental-agreement/list">
                                            <img
                                                src="/icons/rental-agreement.svg"
                                                alt="Rental Agreement Icon"
                                            />
                                            <span>Rental Agreements</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/rental-agreement/list-report">
                                            <img
                                                src="/icons/rental-agreement.svg"
                                                alt="Rental Agreement Icon"
                                            />
                                            <span>
                                                Rental Agreements Report
                                            </span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/rental-agreement-payment-report">
                                            <img
                                                src="/icons/rental-agreement.svg"
                                                alt="Rental Agreement Icon"
                                            />
                                            <span>
                                                Rental Agreements Payment Report
                                            </span>
                                        </NavLink>
                                    </li>
                                </>
                            )}

                            {(customersPermission.canView || hasPermission("view_watchmen")) && (
                                <div className={styles.divider} />
                            )}

                            {customersPermission.canView && (
                                <li>
                                    <NavLink to="/database/list">
                                        <img
                                            src="/icons/database.svg"
                                            alt="Database Icon"
                                        />
                                        <span>Database</span>
                                    </NavLink>
                                </li>
                            )}
                            
                            {hasPermission("view_requirements") && (
                                <li>
                                    <NavLink to="/requirements">
                                        <img
                                            src="/icons/requirements.svg"
                                            alt="Requirements Icon"
                                        />
                                        <span>Requirements</span>
                                    </NavLink>
                                </li>
                            )}

                            {hasPermission("view_watchmen") && (
                                <li>
                                    <NavLink to="/new-watchmen/list">
                                        <img
                                            src="/icons/watchmen.svg"
                                            alt="WatchMen Icon"
                                        />
                                        <span>Watchmen</span>
                                    </NavLink>
                                </li>
                            )}

                            <div className={styles.divider} />

                            {hasPermission("view_kpi") && (
                                <li>
                                    <NavLink to="/kpi-submissions">
                                        <img src="/icons/kpi.svg" alt="KPI Icon" />
                                        <span>KPI Submissions</span>
                                    </NavLink>
                                </li>
                            )}

                            {customersPermission.canView && (
                                <li>
                                    <NavLink to="/contacts">
                                        <img
                                            src="/icons/address-book.svg"
                                            alt="Contacts Icon"
                                        />
                                        <span>Contacts</span>
                                    </NavLink>
                                </li>
                            )}

                            {reportsPermission.canView && (
                                <li>
                                    <NavLink to="/followup-report">
                                        <img
                                            src="/icons/calendar-white.svg"
                                            alt="Upcoming Followups Icon"
                                        />
                                        <span>Upcoming Followups</span>
                                    </NavLink>
                                </li>
                            )}

                            {(transactionsPermission.canView) && (
                                <li>
                                    <NavLink to="/transactions">
                                        <img
                                            src="/icons/transactions.svg"
                                            alt="Transactions Icon"
                                        />
                                        <span>Transactions</span>
                                    </NavLink>
                                </li>
                            )}

                            {vehiclesPermission.canView && (
                                <div className={styles.divider} />
                            )}

                            {vehiclesPermission.canView && (
                                <li>
                                    <NavLink to="/vehicles/for-rent">
                                        <img
                                            src="/icons/car.svg"
                                            alt="Vehicles Icon"
                                        />
                                        <span>Rent Vehicles list</span>
                                    </NavLink>
                                </li>
                            )}

                            {(features?.sell_vehicles_list || vehiclesPermission.canView) && (
                                <>
                                    <li>
                                        <NavLink to="/vehicles/for-sell">
                                            <img
                                                src="/icons/car.svg"
                                                alt="Vehicles Icon"
                                            />
                                            <span>Sell Vehicles list</span>
                                        </NavLink>
                                    </li>

                                    <li>
                                        <NavLink to="/manufacturers/list">
                                            <img
                                                src="/icons/manufacturers.svg"
                                                alt="Vehicles Icon"
                                            />
                                            <span>Brands list</span>
                                        </NavLink>
                                    </li>
                                </>
                            )}

                            {agentPermission.canManage && (
                                <>
                                    <div className={styles.divider} />
                                    <li>
                                        <NavLink to="/agent-leads">
                                            <img
                                                src="/icons/leads.svg"
                                                alt="Agent Leads Icon"
                                            />
                                            <span>Agent Leads</span>
                                        </NavLink>
                                    </li>
                                </>
                            )}
                            
                            {viewingsPermission.canView && (
                                <li>
                                    <NavLink to="/viewings">
                                        <img
                                            src="/icons/calendar-white.svg"
                                            alt="Viewings Icon"
                                            style={{
                                                filter: "brightness(0) invert(1)",
                                            }}
                                        />
                                        <span>Viewings</span>
                                    </NavLink>
                                </li>
                            )}

                            {/* Always accessible items */}
                            <div className={styles.divider} />
                            
                            <li>
                                <NavLink to="/profile">
                                    <img
                                        src="/icons/person.svg"
                                        alt="Profile Icon"
                                    />
                                    <span>Profile</span>
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/support">
                                    <img
                                        src="/icons/support.svg"
                                        alt="Support Icon"
                                    />
                                    <span>Support</span>
                                </NavLink>
                            </li>

                            {/* Debug info - remove in production */}
                            {process.env.NODE_ENV === 'development' && (
                                <li style={{ fontSize: '10px', color: '#ccc', marginTop: '20px' }}>
                                    <div>Permissions: {userPermissions?.length || 0}</div>
                                    <div>Features: {Object.keys(features).length}</div>
                                </li>
                            )}
                        </ul>
                    </div>
                </nav>
            </aside>

            <div
                onClick={handleToggleHamburger}
                className={styles.mobileToggle}
                style={{
                    background:
                        data?.company_settings?.sidebar_color_code || "#020079",
                }}
            >
                <img src="/icons/chevron-left.svg" alt="Toggle mobile menu" />
            </div>

            {/* Mobile overlay removed to fix white screen issue */}
        </>
    );
}

export default CustomSideNav;
