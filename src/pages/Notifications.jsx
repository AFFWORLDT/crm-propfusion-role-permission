import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import NotificationFilters from "../features/notifications/NotificationFilters";
import useNotifications from "../features/notifications/useNotifications";
import SectionTop from "../ui/SectionTop";
import Spinner from "../ui/Spinner";
import toast from "react-hot-toast";
import NotificationList from "../features/notifications/NotificationList";
import Pagination from "../ui/Pagination";
import TabBar from "../ui/TabBar";

const filterTypes = [
    "listings",
    "reminder",
    "commission",
    "transaction",
    "leads",
];

function Notifications() {
    const containerRef = useRef(null);
    
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Get current filter from URL or default to first type
    const currentFilter = searchParams.get("notification_type") || filterTypes[0];
    
    const [selectedNotificationIds, setSelectedNotificationIds] = useState([]);
    
    const {
        data,
        isLoading,
        error,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        unseenNotificationCountsByType,
        totalSize,
    } = useNotifications();

    const containerHeight = data?.length > 10 ? "100vh" : "auto";
    
    useEffect(() => {
        if (!searchParams.has("notification_type")) {
            setSearchParams({ notification_type: filterTypes[0] });
        }
    }, [searchParams, setSearchParams]);
    
    useEffect(() => {
        if (error) toast.error(error.message || "Failed to load notifications");
    }, [error]);

    function handleFilter(type) {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set("notification_type", type);
            newParams.set("page", "1");
            return newParams;
        });
        setSelectedNotificationIds([]);
    }
    
    function handleCheck(id) {
        if (!selectedNotificationIds.includes(id)) {
            setSelectedNotificationIds(prev => [...prev, id]);
        }
    }
    
    function handleUncheck(id) {
        setSelectedNotificationIds(prev => 
            prev.filter(item => item !== id)
        );
    }
    
    function handlePageChange(newPage) {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set("page", newPage.toString());
            return newParams;
        });
    }
    
    return (
        <div className="sectionContainer">
            <SectionTop heading="Notifications">
                <TabBar
                    tabs={[
                        {
                            id: "NOTIFICATIONS",
                            label: "Notifications", 
                            bgColor: "#f7f0ff",
                            fontColor: "#9966cc",
                            path: "/notifications",
                        },
                    ]}
                    activeTab={"NOTIFICATIONS"}
                    navigateTo={() => `/notifications?notification_type=${currentFilter}`}
                />
            </SectionTop>
            <section className="sectionStyles" style={{ backgroundColor: "#f7f0ff" }}>
                <div ref={containerRef} style={{ paddingBottom: "2.4rem", height: containerHeight, overflowY: "auto" }} className="sectionDiv">
                    <NotificationFilters
                        currentFilter={currentFilter}
                        onFilter={handleFilter}
                        selectedNotificationIds={selectedNotificationIds}
                        unseenNotificationCountsByType={unseenNotificationCountsByType}
                    />
                    {isLoading ? (
                        <Spinner type="fullPage" />
                    ) : error ? (
                        <div className="error-message">
                            Unable to load notifications. Please try again.
                        </div>
                    ) : (
                        <NotificationList
                            filteredData={data}
                            onCheck={handleCheck}
                            onUncheck={handleUncheck}
                            error={error}
                            totalSize={totalSize}
                            isLoading={isLoading}
                            containerRef={containerRef}
                            hasNextPage={hasNextPage}
                            fetchNextPage={fetchNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                        />
                    )}
                    <Pagination 
                        totalSize={totalSize} 
                        isLoading={isLoading}
                        currentPage={Number(searchParams.get("page") || "1")}
                        onPageChange={handlePageChange}
                    />
                </div>
            </section>
        </div>
    );
}

export default Notifications;