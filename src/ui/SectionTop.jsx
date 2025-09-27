import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Menus from "./Menus";
import styles from "./SectionTop.module.css";
import commandMenuStyles from "./CommandMenu.module.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import useAllDetails from "../features/all-details/useAllDetails";
import useBrowserWidth from "../hooks/useBrowserWidth";
import DaysCounter from "../components/DaysCounter";
import DummyImage from "./../assets/dummy-person.png";
import { usePermissionCheck, useManagePermission, useAdminPermissions } from "../hooks/usePermissionCheck";

const randomId = uuidv4();

const headingStyle = {
    fontSize: "1.5rem",
    padding: "1rem",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    letterSpacing: "-0.025em",
    color: "var(--secondary-300)",
};

function getShortcut() {
    if (typeof navigator !== "undefined") {
        return /Mac|iPod|iPhone|iPad/.test(navigator.platform)
            ? "⌥⇧K"
            : "Alt+Shift+K";
    }
    return "Alt+Shift+K";
}

function getSellShortcut() {
    if (typeof navigator !== "undefined") {
        return /Mac|iPod|iPhone|iPad/.test(navigator.platform)
            ? "⌥ S"
            : "Alt S";
    }
    return "Alt S";
}

function getProjectShortcut() {
    if (typeof navigator !== "undefined") {
        return /Mac|iPod|iPhone|iPad/.test(navigator.platform)
            ? "⌥ P"
            : "Alt P";
    }
    return "Alt P";
}
function getRentShortcut() {
    if (typeof navigator !== "undefined") {
        return /Mac|iPod|iPhone|iPad/.test(navigator.platform)
            ? "⌥ R"
            : "Alt R";
    }
    return "Alt R";
}

function getLeadsShortcut() {
    if (typeof navigator !== "undefined") {
        return /Mac|iPod|iPhone|iPad/.test(navigator.platform)
            ? "⌥ L"
            : "Alt L";
    }
    return "Alt L";
}
function getContractShortcut() {
    if (typeof navigator !== "undefined") {
        return /Mac|iPod|iPhone|iPad/.test(navigator.platform)
            ? "⌥ C"
            : "Alt C";
    }
    return "Alt C";
}
function getDatabaseShortcut() {
    if (typeof navigator !== "undefined") {
        return /Mac|iPod|iPhone|iPad/.test(navigator.platform)
            ? "⌥ D"
            : "Alt D";
    }
    return "Alt D";
}
function getTenantsShortcut() {
    if (typeof navigator !== "undefined") {
        return /Mac|iPod|iPhone|iPad/.test(navigator.platform)
            ? "⌥ T"
            : "Alt T";
    }
    return "Alt T";
}
function getInvestorsShortcut() {
    if (typeof navigator !== "undefined") {
        return /Mac|iPod|iPhone|iPad/.test(navigator.platform)
            ? "⌥ I"
            : "Alt I";
    }
    return "Alt I";
}

function SectionTop({ heading, children }) {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const browserWidth = useBrowserWidth();
    
    // Permission hooks
    const { hasPermission } = usePermissionCheck();
    const usersPermission = useManagePermission("users");
    const teamsPermission = useManagePermission("teams");
    const settingsPermission = useManagePermission("settings");
    const systemPermission = useManagePermission("system");
    const supportPermission = useManagePermission("support");
    const notificationsPermission = useManagePermission("notifications");
    const calendarsPermission = useManagePermission("calendars");
    const blogsPermission = useManagePermission("blogs");
    const agentPermission = useManagePermission("agent");
    const propertiesPermission = useManagePermission("properties");
    const projectsPermission = useManagePermission("projects");
    const leadsPermission = useManagePermission("leads");
    const contractsPermission = useManagePermission("contracts");
    const customersPermission = useManagePermission("customers");
    const adminPermissions = useAdminPermissions();
    
    const adminNavData = [
        { name: "Staff", navigateTo: "/admin/staff", permission: usersPermission.canView },
        { name: "Teams", navigateTo: "/admin/teams", permission: teamsPermission.canView },
        { name: "Watermark", navigateTo: "/admin/watermark", permission: settingsPermission.canManage },
        { name: "Integrations", navigateTo: "/admin/integrations", permission: hasPermission("view_integrations") },
        { name: "Data Import", navigateTo: "/admin/data-import", permission: systemPermission.canManage },
        { name: "General", navigateTo: "/admin/general", permission: settingsPermission.canManage },
    ].filter(item => item.permission);

    const [toggleActive, setToggleActive] = useState(false);
    const { data: unseenNotificationCount, error, isLoading } = useAllDetails();
    const [showCommandMenu, setShowCommandMenu] = useState(false);

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    useEffect(() => {
        function handleKeyDown(e) {
            // Only trigger on Alt/Option + Shift + K
            if (
                e.altKey &&
                e.shiftKey &&
                !e.ctrlKey &&
                !e.metaKey &&
                e.code === "KeyK"
            ) {
                console.log("Alt/Option + Shift + K detected");
                e.preventDefault();
                setShowCommandMenu(true);
                return;
            }
            // Sell shortcut - check properties permission
            if (
                e.altKey &&
                !e.shiftKey &&
                !e.ctrlKey &&
                !e.metaKey &&
                e.code === "KeyS"
            ) {
                e.preventDefault();
                if (propertiesPermission.canView) {
                    navigate("/for-sell/new-list?status=ACTIVE");
                } else {
                    toast.error("You don't have permission to access properties");
                }
                return;
            }
            // Project shortcut - check projects permission
            if (
                e.altKey &&
                !e.shiftKey &&
                !e.ctrlKey &&
                !e.metaKey &&
                e.code === "KeyP"
            ) {
                e.preventDefault();
                if (projectsPermission.canView) {
                    navigate("/new-projects/list?status=ACTIVE");
                } else {
                    toast.error("You don't have permission to access projects");
                }
                return;
            }
            // Rent shortcut - check properties permission
            if (
                e.altKey &&
                !e.shiftKey &&
                !e.ctrlKey &&
                !e.metaKey &&
                e.code === "KeyR"
            ) {
                e.preventDefault();
                if (propertiesPermission.canView) {
                    navigate("/for-rent/new-list?status=ACTIVE");
                } else {
                    toast.error("You don't have permission to access properties");
                }
                return;
            }
            // Leads shortcut - check leads permission
            if (
                e.altKey &&
                !e.shiftKey &&
                !e.ctrlKey &&
                !e.metaKey &&
                e.code === "KeyL"
            ) {
                e.preventDefault();
                if (leadsPermission.canView || leadsPermission.canManage) {
                    navigate("/leads/sell?viewType=pipeline");
                } else {
                    toast.error("You don't have permission to access leads");
                }
                return;
            }
            // Contract shortcut - check contracts permission
            if (
                e.altKey &&
                !e.shiftKey &&
                !e.ctrlKey &&
                !e.metaKey &&
                e.code === "KeyC"
            ) {
                e.preventDefault();
                if (contractsPermission.canView || hasPermission("view_contracts")) {
                    navigate("/contract/new-contract");
                } else {
                    toast.error("You don't have permission to access contracts");
                }
                return;
            }
            // Database shortcut - check customers permission
            if (
                e.altKey &&
                !e.shiftKey &&
                !e.ctrlKey &&
                !e.metaKey &&
                e.code === "KeyD"
            ) {
                e.preventDefault();
                if (customersPermission.canView) {
                    navigate("/database/list");
                } else {
                    toast.error("You don't have permission to access database");
                }
                return;
            }
            // Tenants shortcut - check customers permission
            if (
                e.altKey &&
                !e.shiftKey &&
                !e.ctrlKey &&
                !e.metaKey &&
                e.code === "KeyT"
            ) {
                e.preventDefault();
                if (customersPermission.canView) {
                    navigate("/for-tenants/new-list");
                } else {
                    toast.error("You don't have permission to access tenants");
                }
                return;
            }
            // Investors shortcut - check customers permission
            if (
                e.altKey &&
                !e.shiftKey &&
                !e.ctrlKey &&
                !e.metaKey &&
                e.code === "KeyI"
            ) {
                e.preventDefault();
                if (customersPermission.canView) {
                    navigate("/for-owner/new-list");
                } else {
                    toast.error("You don't have permission to access investors");
                }
                return;
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [navigate]);

    return (
        <div
            className={styles.sectionTop}
            style={
                children
                    ? { paddingLeft: "2rem", paddingRight: "2rem" }
                    : {
                          paddingLeft: "1rem",
                          paddingRight: "1rem",
                      }
            }
        >
            {children ? (
                children
            ) : (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderTop: "1px solid rgb(226, 232, 240)",
                        borderRight: "1px solid rgb(226, 232, 240)",
                        borderBottom: "none",
                        borderLeft: "1px solid rgb(226, 232, 240)",
                        fontSize: "15px",
                        fontWeight: "500",
                        backgroundColor: "rgb(245, 245, 245)",
                        borderTopLeftRadius: "1rem",
                        borderTopRightRadius: "1rem",
                        padding: "0.5rem 1rem",
                    }}
                >
                    <h1 style={headingStyle}>{heading}</h1>
                </div>
            )}

            <div className={styles.rightContainer}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.2rem",
                        flexWrap: "nowrap",
                    }}
                >
                    <DaysCounter />
                </div>
                {(supportPermission.canManage || hasPermission("manage_support")) && (
                    <Link
                        to="/admin/requests"
                        className={styles.btnNotification}
                        aria-label={`Requests. ${unseenNotificationCount?.pending_portal_requests_count || 0} new`}
                    >
                        <img src="/icons/request.svg" alt="" />
                        {unseenNotificationCount?.pending_portal_requests_count >
                            0 && (
                            <div role="status" aria-live="polite">
                                {
                                    unseenNotificationCount?.pending_portal_requests_count
                                }
                            </div>
                        )}
                    </Link>
                )}
                {browserWidth > 768 && (calendarsPermission.canManage || hasPermission("manage_calendars")) && (
                    <Link to="/gcalendar">
                        <img src="/icons/calendar.svg" alt="" />
                    </Link>
                )}

                {(notificationsPermission.canView || hasPermission("view_notifications")) && (
                    <Link
                        className={styles.btnNotification}
                        to="/notifications"
                        aria-label={`Notifications. ${unseenNotificationCount?.unseen_notifications_count || 0} unread`}
                    >
                        <img src="/icons/bell.svg" alt="" />
                        {unseenNotificationCount?.unseen_notifications_count >
                            0 && (
                            <div role="status" aria-live="polite">
                                {
                                    unseenNotificationCount?.unseen_notifications_count
                                }
                            </div>
                        )}
                    </Link>
                )}

                <Menus>
                    <Menus.Toggle id={currentUser?.id} isDisabled={isLoading}>
                        <img
                            src={
                                unseenNotificationCount?.current_user_details
                                    ?.avatar || DummyImage
                            }
                            width={32}
                            height={32}
                            onError={(e) => {
                                e.currentTarget.src = DummyImage;
                            }}
                        />
                    </Menus.Toggle>
                    <Menus.List id={currentUser?.id}>
                        <Menus.Button
                            onClick={() => navigate("/profile")}
                            icon="/icons/person.svg"
                        >
                            Profile
                        </Menus.Button>
                        {(hasPermission("view_analytics") || adminPermissions.canViewAnalytics) && (
                            <Menus.Button
                                onClick={() => navigate(`/admin/map/${randomId}`)}
                                icon="/icons/map.svg"
                            >
                                MapView
                            </Menus.Button>
                        )}

                        {(hasPermission("manage_emails") || adminPermissions.canManageEmails) && (
                            <Menus.Button
                                onClick={() => navigate(`/admin/fusionmails`)}
                                icon="/icons/mail.svg"
                            >
                                FusionMails
                            </Menus.Button>
                        )}
                        
                        {(blogsPermission.canView || hasPermission("view_blogs")) && (
                            <Menus.Button
                                onClick={() => navigate(`/admin/blog`)}
                                icon="/icons/blog.svg"
                            >
                                <span>Blog</span>
                            </Menus.Button>
                        )}
                        
                        {(teamsPermission.canView || hasPermission("view_teams")) && (
                            <Menus.Button
                                onClick={() => navigate(`/admin/teams-tree`)}
                                icon="/icons/tree.svg"
                            >
                                <span>Team Tree</span>
                            </Menus.Button>
                        )}
                        
                        {/* Affiliate Tree - show for users with manage_agent or basic_affiliate permission */}
                        {(agentPermission.canManage || hasPermission("manage_agent") || hasPermission("basic_affiliate")) && (
                            <Menus.Button
                                onClick={() => navigate(`/admin/affiliate-tree`)}
                                icon="/icons/tree.svg"
                            >
                                <span>Affiliate Tree</span>
                            </Menus.Button>
                        )}
                        
                        {/* Affiliate Wallet - show for users with manage_agent or basic_affiliate permission */}
                        {(agentPermission.canManage || hasPermission("manage_agent") || hasPermission("basic_affiliate")) && (
                            <Menus.Button
                                onClick={() => navigate(`/admin/affiliate-wallet`)}
                                icon="/icons/wallet.svg"
                            >
                                <span>Affiliate Wallet</span>
                            </Menus.Button>
                        )}
                        
                        {/* QR Code - show for users with manage_agent or basic_affiliate permission */}
                        {(agentPermission.canManage || hasPermission("manage_agent") || hasPermission("basic_affiliate")) && (
                            <Menus.Button
                                onClick={() => navigate(`/admin/affiliate`)}
                                icon="/icons/grid.svg"
                            >
                                <span>QR Code</span>
                            </Menus.Button>
                        )}
                        
                        {(calendarsPermission.canManage || hasPermission("manage_calendars")) && (
                            <Menus.Button
                                onClick={() => navigate(`/hrcalendar`)}
                                icon="/icons/calendar.svg"
                            >
                                <span>Hr Calendar</span>
                            </Menus.Button>
                        )}
                        

                        {(settingsPermission.canManage || adminPermissions.canManageSettings) && (
                            <div
                                onClick={() => setToggleActive(!toggleActive)}
                                className={`${styles.btnSettings} ${toggleActive ? styles.toggleActive : ""}`}
                            >
                                <div>
                                    <img src="/icons/settings.svg" />
                                    <span>Settings</span>
                                    <img
                                        className={styles.arrowDown}
                                        src="/icons/arrow-down.svg"
                                    />
                                </div>
                                {toggleActive && (
                                    <>
                                        {
                                            <>
                                                <ul>
                                                    {adminNavData.map((item) => (
                                                        <li key={item.name}>
                                                            <Link
                                                                to={item.navigateTo}
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </>
                                        }
                                    </>
                                )}
                            </div>
                        )}

                        {(supportPermission.canManage || hasPermission("manage_support")) && (
                            <Menus.Button
                                onClick={() => navigate(`/support`)}
                                icon="/icons/support.svg"
                            >
                                <span>Support</span>
                            </Menus.Button>
                        )}
                        <Menus.Button
                            customStyle={{
                                color: "#cb1919",
                            }}
                            onClick={logout}
                            icon="/icons/logout.svg"
                        >
                            Logout
                        </Menus.Button>
                    </Menus.List>
                </Menus>
                {showCommandMenu && (
                    <div
                        className={commandMenuStyles.overlay}
                        onClick={() => setShowCommandMenu(false)}
                    >
                        <div
                            className={commandMenuStyles.modal}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className={commandMenuStyles.closeButton}
                                onClick={() => setShowCommandMenu(false)}
                                title="Close"
                                aria-label="Close command menu"
                            >
                                ×
                            </button>

                            <div className={commandMenuStyles.iconWrapper}>
                                <img
                                    src="/icons/sparkles.svg"
                                    alt="Command"
                                    className={commandMenuStyles.icon}
                                />
                            </div>

                            <h2 className={commandMenuStyles.title}>
                                Command Menu
                            </h2>

                            <p className={commandMenuStyles.description}>
                                Your productivity superpowers. Press{" "}
                                <kbd className={commandMenuStyles.kbd}>
                                    {getShortcut()}
                                </kbd>{" "}
                                or click outside to close.
                            </p>

                            <div style={{ width: "100%" }}>
                                <strong
                                    className={commandMenuStyles.shortcutsTitle}
                                >
                                    Shortcuts
                                </strong>
                                <ul className={commandMenuStyles.shortcutsList}>
                                    <li
                                        className={
                                            commandMenuStyles.shortcutItem
                                        }
                                    >
                                        <kbd className={commandMenuStyles.kbd}>
                                            {getShortcut()}
                                        </kbd>
                                        <span
                                            className={
                                                commandMenuStyles.shortcutText
                                            }
                                        >
                                            Open Command Menu
                                        </span>
                                    </li>
                                    <li
                                        className={
                                            commandMenuStyles.shortcutItem
                                        }
                                    >
                                        <kbd className={commandMenuStyles.kbd}>
                                            {getSellShortcut()}
                                        </kbd>
                                        <span
                                            className={
                                                commandMenuStyles.shortcutText
                                            }
                                        >
                                            Go to Sell New List
                                            <span
                                                className={
                                                    commandMenuStyles.activeTag
                                                }
                                            >
                                                (ACTIVE)
                                            </span>
                                        </span>
                                    </li>
                                    <li
                                        className={
                                            commandMenuStyles.shortcutItem
                                        }
                                    >
                                        <kbd className={commandMenuStyles.kbd}>
                                            {getProjectShortcut()}
                                        </kbd>
                                        <span
                                            className={
                                                commandMenuStyles.shortcutText
                                            }
                                        >
                                            Go to Projects List
                                            <span
                                                className={
                                                    commandMenuStyles.activeTag
                                                }
                                            >
                                                (ACTIVE)
                                            </span>
                                        </span>
                                    </li>
                                    <li
                                        className={
                                            commandMenuStyles.shortcutItem
                                        }
                                    >
                                        <kbd className={commandMenuStyles.kbd}>
                                            {getRentShortcut()}
                                        </kbd>
                                        <span
                                            className={
                                                commandMenuStyles.shortcutText
                                            }
                                        >
                                            Go to Rent New List
                                            <span
                                                className={
                                                    commandMenuStyles.activeTag
                                                }
                                            >
                                                (ACTIVE)
                                            </span>
                                        </span>
                                    </li>
                                    <li
                                        className={
                                            commandMenuStyles.shortcutItem
                                        }
                                    >
                                        <kbd className={commandMenuStyles.kbd}>
                                            {getLeadsShortcut()}
                                        </kbd>
                                        <span
                                            className={
                                                commandMenuStyles.shortcutText
                                            }
                                        >
                                            Go to Leads Pipeline
                                        </span>
                                    </li>
                                    <li
                                        className={
                                            commandMenuStyles.shortcutItem
                                        }
                                    >
                                        <kbd className={commandMenuStyles.kbd}>
                                            {getContractShortcut()}
                                        </kbd>
                                        <span
                                            className={
                                                commandMenuStyles.shortcutText
                                            }
                                        >
                                            Go to New Contract
                                        </span>
                                    </li>
                                    <li
                                        className={
                                            commandMenuStyles.shortcutItem
                                        }
                                    >
                                        <kbd className={commandMenuStyles.kbd}>
                                            {getDatabaseShortcut()}
                                        </kbd>
                                        <span
                                            className={
                                                commandMenuStyles.shortcutText
                                            }
                                        >
                                            Go to Database List
                                        </span>
                                    </li>
                                    <li
                                        className={
                                            commandMenuStyles.shortcutItem
                                        }
                                    >
                                        <kbd className={commandMenuStyles.kbd}>
                                            {getTenantsShortcut()}
                                        </kbd>
                                        <span
                                            className={
                                                commandMenuStyles.shortcutText
                                            }
                                        >
                                            Go to Tenants New List
                                        </span>
                                    </li>
                                    <li
                                        className={
                                            commandMenuStyles.shortcutItem
                                        }
                                    >
                                        <kbd className={commandMenuStyles.kbd}>
                                            {getInvestorsShortcut()}
                                        </kbd>
                                        <span
                                            className={
                                                commandMenuStyles.shortcutText
                                            }
                                        >
                                            Go to Investors New List
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SectionTop;
