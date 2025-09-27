import { useCallback, useEffect, useRef, useState } from "react";
import useInfiniteViewingsLists from "../../features/viewings/useGetInfniteViewingsLists";
import SectionTop from "../../ui/SectionTop";
import "./ViewingsList.css";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import ScrollToTop from "../../ui/ScrollToTop";
import ViewingsInTable from "../../features/viewings/ViewingsInTable";
import ViewingsInGrid from "../../features/viewings/ViewingsInGrid";
import ToggleButton from "../../ui/ToggleButton";
import { Search } from "lucide-react";
import AddViewingFrom from "../../features/viewings/AddViewingFrom";
import ViewingFilter from "../../features/viewings/ViewingFilter";
import TabBar from "../../ui/TabBar";
import { KPI_CONTRACTS_TABS } from "../../utils/constants";
import { useMyPermissions } from "../../hooks/useHasPermission";
import PageNotFound from "../PageNotFound";

const ViewingsList = () => {
    const containerRef = useRef(null);
    const [currentView, setCurrentView] = useState("table");
    const {
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        totalSize,
        viewings,
    } = useInfiniteViewingsLists();
    const { hasPermission } = useMyPermissions();
    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

        if (isNearBottom && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener("scroll", handleScroll);

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [handleScroll]);

    useEffect(() => {
        if (error) {
            toast.error("Failed to load viewings. Please try again later.");
        }
    }, [error]);

    if (isLoading) {
        return (
            <>
                <Spinner type={"fullPage"} />
            </>
        );
    }
    if (!hasPermission("view_viewings")) return <PageNotFound />;
    return (
        <div className="sectionContainer">
            <SectionTop>
                <TabBar
                    tabs={KPI_CONTRACTS_TABS}
                    activeTab={"VIEWINGS"}
                    navigateTo={(tabId) => {
                        if (tabId === "KPI_SUBMISSIONS") {
                            return "/kpi-submissions?viewType=table";
                        }
                        if (tabId === "CONTACTS") {
                            return "/contacts";
                        }
                        if (tabId === "TRANSACTIONS") {
                            return "/transactions";
                        }
                        if (tabId === "KPI_SUBMISSIONS") {
                            return "/kpi-submissions?viewType=table";
                        }
                        return `/viewings`;
                    }}
                />
            </SectionTop>

            <section
                className="sectionStyles"
                ref={containerRef}
                style={{
                    height: "calc(100vh - 10px)", // Adjusted height to account for header
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    position: "relative",
                }}
            >
                <ToggleButton>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            gap: "1rem",
                            marginBottom: "1rem",
                            paddingTop: "4rem",
                        }}
                    >
                        {/* <ExtraFilters
                                totalSize={totalSize}
                                buttonOptions={[
                                    { label: "Scheduled", value: "scheduled" },
                                    { label: "Completed", value: "completed" },
                                    { label: "Cancelled", value: "cancelled" },
                                    { label: "Rescheduled", value: "rescheduled" },
                                    { label: "No Show", value: "no_show" },
                                ]}
                            /> */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                                flexWrap: "wrap",
                            }}
                        >
                            {/* View Switcher Buttons */}
                            <div className="view-switcher">
                                <button
                                    onClick={() => setCurrentView("table")}
                                    className={
                                        currentView === "table" ? "active" : ""
                                    }
                                >
                                    Table View
                                </button>
                                <button
                                    onClick={() => setCurrentView("grid")}
                                    className={
                                        currentView === "grid" ? "active" : ""
                                    }
                                >
                                    Grid View
                                </button>
                            </div>

                            <ToggleButton.Button
                                label="Advanced Filter"
                                icon={<Search />}
                                style={{
                                    "--toggleBtn-primary": "#000",
                                    border: "1px solid #000",
                                    backgroundColor: "transparent",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "0.5rem",
                                    color: "#000",
                                }}
                            />
                            {hasPermission("schedule_viewings") && (
                                <AddViewingFrom>
                                    <button className="btnNormalSmall">
                                        <span style={{ color: "#ffff" }}>
                                            Add
                                        </span>
                                    </button>
                                </AddViewingFrom>
                            )}
                        </div>
                    </div>
                    <ToggleButton.Content>
                        <div
                            className="LEADSfilter"
                            style={{
                                padding: "1.5rem",
                                borderTop: "1px solid #eee",
                                backgroundColor: "transparent",
                            }}
                        >
                            <ViewingFilter />
                        </div>
                    </ToggleButton.Content>
                </ToggleButton>
                {/* Conditionally render based on currentView */}
                {currentView === "table" ? (
                    <ViewingsInTable
                        isLoading={isLoading}
                        error={error}
                        data={viewings}
                        totalSize={totalSize}
                        fetchNextPage={fetchNextPage}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                    />
                ) : (
                    <ViewingsInGrid
                        isLoading={isLoading}
                        error={error}
                        data={viewings}
                        totalSize={totalSize}
                        fetchNextPage={fetchNextPage}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                    />
                )}
            </section>
            <ScrollToTop containerRef={containerRef} />
        </div>
    );
};

export default ViewingsList;
