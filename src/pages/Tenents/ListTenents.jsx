import { PlusCircle, Search, Grid, List } from "lucide-react";
import styles from "./TenantList.module.css";
import SectionTop from "../../ui/SectionTop";
import { useState, useRef } from "react";
import TabBar from "../../ui/TabBar";
import { TENANT_OWNER_CONTRACT_TABS } from "../../utils/constants";
import { useLocation, useNavigate } from "react-router-dom";
import ScrollToTop from "../../ui/ScrollToTop";
import Spinner from "../../ui/Spinner";
import useInfiniteTenants from "../../features/Tenants/useInfiniteTenants";
import useAllDetails from "../../features/all-details/useAllDetails";
import { lazyLoad } from "../../utils/lazyLoad";
import SuspenseWrapper from "../../components/SuspenseWrapper";
import Loading from "../../components/Loading";

// Lazy load components
const NewTenants = lazyLoad(() => import("../../features/Tenants/NewTenants"));
const TenantTableView = lazyLoad(() => import("../../features/Tenants/TenantTableView"));
const TenantFormModal = lazyLoad(() => import("../../features/Tenants/TenantFormModal"));

function ListTenants() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'
    const location = useLocation();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const { data } = useAllDetails();
    const sidebarColor = data?.company_settings?.sidebar_color_code || "#020079";

    const {
        tenants,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteTenants(searchQuery);

    const activeTab =
        TENANT_OWNER_CONTRACT_TABS.find((tab) => tab.path === location.pathname)
            ?.id || "TENANTS";

    const currentTab = TENANT_OWNER_CONTRACT_TABS.find(
        (tab) => tab.id === activeTab
    );
    const bgColor = currentTab?.bgColor || "#ffffff";

    const handleAddClick = () => {
        setShowAddModal(true);
    };

    const handleTabClick = (tabId) => {
        const tab = TENANT_OWNER_CONTRACT_TABS.find(tab => tab.id === tabId);
        if (tab) {
            navigate(tab.path);
        }
    };

    return (
        <div className="sectionContainer">
            <SectionTop heading="Tenants Management">
                <TabBar
                    tabs={TENANT_OWNER_CONTRACT_TABS}
                    activeTab={activeTab}
                    onTabClick={handleTabClick}
                />
            </SectionTop>
            <section
                className={`sectionStyles`}
                ref={containerRef}
                style={{
                    backgroundColor: bgColor,
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    WebkitScrollbar: "none",
                    position: "relative",
                    paddingTop: "8rem",
                    margin: "0",
                    height: "100vh",
                    maxHeight: "100vh",
                }}
            >
                <div className={styles.header}>
                    <div className={styles.searchContainer}>
                        <Search size={20} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search tenants..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    <div className={styles.viewControls}>
                        <button
                            className={`${styles.viewButton} ${viewMode === "grid" ? styles.active : ""}`}
                            onClick={() => setViewMode("grid")}
                            title="Grid View"
                        >
                            <Grid size={20} />
                        </button>
                        <button
                            className={`${styles.viewButton} ${viewMode === "table" ? styles.active : ""}`}
                            onClick={() => setViewMode("table")}
                            title="Table View"
                        >
                            <List size={20} />
                        </button>
                        <button
                            className={styles.addButton}
                            onClick={handleAddClick}
                            style={{ background: sidebarColor, color: "#fff" }}
                        >
                            <PlusCircle size={20} />
                            <span>Add Tenant</span>
                        </button>
                    </div>
                </div>

                {viewMode === "grid" ? (
                    <SuspenseWrapper fallback={<Loading message="Loading tenants grid view..." />}>
                        <NewTenants
                            isLoading={isLoading}
                            error={error}
                            tenants={tenants}
                            fetchNextPage={fetchNextPage}
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            containerRef={containerRef}
                        />
                    </SuspenseWrapper>
                ) : (
                    <SuspenseWrapper fallback={<Loading message="Loading tenants table view..." />}>
                        <TenantTableView
                            isLoading={isLoading}
                            error={error}
                            tenants={tenants}
                            fetchNextPage={fetchNextPage}
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            containerRef={containerRef}
                        />
                    </SuspenseWrapper>
                )}
                <ScrollToTop containerRef={containerRef} />
            </section>

            <SuspenseWrapper fallback={<Loading message="Loading tenant form..." />}>
                <TenantFormModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    mode="add"
                />
            </SuspenseWrapper>
        </div>
    );
}

export default ListTenants;
