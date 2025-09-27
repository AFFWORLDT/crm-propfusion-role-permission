import { useCallback, useEffect, useRef } from "react";
import SectionTop from "../ui/SectionTop";
import useInfiniteKpiLists from "../features/kpi/useInfiniteKpiLists";
import ScrollToTop from "../ui/ScrollToTop";
import KpiInTable from "../features/kpi/KpiInTable";
import toast from "react-hot-toast";
import Spinner from "../ui/Spinner";
import AddKpi from "../features/kpi/AddKpi";
import ToggleButton from "../ui/ToggleButton";
import { Search } from "lucide-react";
import KpiSubmissionFilter from "../features/kpi/KpiSubmissionFilter";
import ViewToggleButton from "../ui/ViewToggleButton";
import { LayoutGrid, LayoutList } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import KpiInGrid from "../features/kpi/KpiInGrid";
import TabBar from "../ui/TabBar";
import { KPI_CONTRACTS_TABS } from "../utils/constants";
import { useMyPermissions } from "../hooks/useHasPermission";
import PageNotFound from "./PageNotFound";

const KpiSubmissions = () => {
    const containerRef = useRef(null);
    const {
        agentData,
        fetchNextPage,
        error,
        isFetchingNextPage,
        isLoading,
        hasNextPage,
        data,
    } = useInfiniteKpiLists();
    const [searchParams, setSearchParams] = useSearchParams();
    const viewType = searchParams.get("viewType") ?? "grid";
    const { hasPermission } = useMyPermissions();

    // Ensure grid is default on first load
    useEffect(() => {
        if (!searchParams.get("viewType")) {
            searchParams.set("viewType", "grid");
            setSearchParams(searchParams, { replace: true });
        }
    }, []);

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

    if (!hasPermission("view_kpi")) {
        return <PageNotFound />;
    }
    if (isLoading) {
        return (
            <>
                <Spinner type={"fullPage"} />
            </>
        );
    }
    return (
        <div className="sectionContainer">
            <SectionTop>
                <TabBar
                    tabs={KPI_CONTRACTS_TABS}
                    activeTab={"KPI_SUBMISSIONS"}
                    navigateTo={(tabId) => {
                        if (tabId === "VIEWINGS") {
                            return "/viewings";
                        }
                        if (tabId === "CONTACTS") {
                            return "/contacts";
                        }
                        if (tabId === "TRANSACTIONS") {
                            return "/transactions";
                        }
                        return `/kpi-submissions`;
                    }}
                />
            </SectionTop>
            <section
                ref={containerRef}
                className="sectionStyles"
                style={{
                    height: "calc(100vh - 10px)",
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    position: "relative",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
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
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                    flexWrap: "wrap",
                                }}
                            >
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
                                <AddKpi>
                                    <button className="btnNormalSmall">
                                        <span style={{ color: "#ffff" }}>
                                            Add
                                        </span>
                                    </button>
                                </AddKpi>
                                <ViewToggleButton
                                    defaultView="grid"
                                    viewParamName="viewType"
                                    viewOptions={[
                                        {
                                            value: "table",
                                            label: "Table View",
                                            icon: <LayoutList size={20} />,
                                        },
                                        {
                                            value: "grid",
                                            label: "Grid View",
                                            icon: <LayoutGrid size={20} />,
                                        },
                                    ]}
                                />
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
                                <KpiSubmissionFilter />
                            </div>
                        </ToggleButton.Content>
                    </ToggleButton>
                </div>

                <div>
                    {viewType === "table" ? (
                        <KpiInTable
                            data={agentData}
                            isLoading={isLoading}
                            isFetchingNextPage={isFetchingNextPage}
                            pagination={{
                                currentPage: data?.pages[0]?.page ?? 1,
                                totalPages: data?.pages[0]?.pages ?? 1,
                                totalItems: data?.pages[0]?.total ?? 0,
                                pageSize: data?.pages[0]?.size ?? 12,
                            }}
                        />
                    ) : (
                        <KpiInGrid data={agentData} isLoading={isLoading} />
                    )}
                    {isFetchingNextPage && (
                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                            <Spinner />
                        </div>
                    )}
                </div>
            </section>
            <ScrollToTop containerRef={containerRef} />
        </div>
    );
};

export default KpiSubmissions;
