import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import SectionTop from "../../ui/SectionTop";
import TabBar from "../../ui/TabBar";
import { TENANT_OWNER_CONTRACT_TABS } from "../../utils/constants";
import useInfiniteOwners from "../../features/Owner/useInfiniteOwners";
import Spinner from "../../ui/Spinner";
import NewOwners from "../../features/newOwners/NewOwners";
import ScrollToTop from "../../ui/ScrollToTop";
import ViewToggleButton from "../../ui/ViewToggleButton";
import { LayoutGrid, LayoutList, Search } from "lucide-react";
import NewOwnersInTable from "../../features/newOwners/NewOwnersInTable";
import ToggleButton from "../../ui/ToggleButton";
import NewOwnerFilters from "../../features/newOwners/NewOwnerFilters";
import AddNewOwnerButton from "../../features/newOwners/AddNewOwnerButton";

function NewOwnersList() {
    const containerRef = useRef(null);
    const [searchParams] = useSearchParams();
    const viewType = searchParams.get("viewType") ?? "table";

    const {
        owners,
        isLoading,
        error,
        totalSize,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteOwners();
    const currentTab = TENANT_OWNER_CONTRACT_TABS.find(
        (tab) => tab.id === "OWNERS"
    );

    const handleScroll = useCallback(() => {
        if (!containerRef.current || viewType !== "card") return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const scrollPercentage =
            (scrollTop / (scrollHeight - clientHeight)) * 100;

        if (scrollPercentage > 80 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, fetchNextPage, isFetchingNextPage, viewType]);

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

    const renderView = () => {
        switch (viewType) {
            case "card":
                return (
                    <NewOwners
                        isLoading={isLoading}
                        error={error}
                        data={owners}
                        totalSize={totalSize}
                        fetchNextPage={fetchNextPage}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                    />
                );
            case "table":
                return (
                    <NewOwnersInTable
                        isLoading={isLoading}
                        error={error}
                        data={owners}
                        totalSize={totalSize}
                        fetchNextPage={fetchNextPage}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                    />
                );

            default:
                return null;
        }
    };

    if (isLoading) {
        return (
            <div>
                <Spinner type={"fullPage"} />
            </div>
        );
    }

    return (
        <div className="sectionContainer">
            <SectionTop>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <TabBar
                        tabs={TENANT_OWNER_CONTRACT_TABS.map(tab =>
                            tab.id === "OWNERS"
                                ? { ...tab, label: "Investors", name: "Investors" }
                                : tab
                        )}
                        activeTab={"OWNERS"}
                        navigateTo={(tabId) => {
                            const tab = TENANT_OWNER_CONTRACT_TABS.find(
                                (t) => t.id === tabId
                            );
                            return tab?.path || "/";
                        }}
                    />
                </div>
            </SectionTop>
            <section
                ref={containerRef}
                className="sectionStyles"
                style={{
                    backgroundColor: currentTab?.bgColor || "#ffffff",
                    height: "calc(100vh)",
                    overflowY: viewType === "card" ? "auto" : "hidden",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    position: "relative",
                    paddingTop: "8rem",
                    paddingLeft: "3rem",
                }}
            >
                <style>
                    {`
                        .sectionStyles::-webkit-scrollbar {
                            display: none;
                        }
                    `}
                </style>
                <ToggleButton>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <ViewToggleButton
                            defaultView="table"
                            viewParamName="viewType"
                            viewOptions={[
                                {
                                    value: "card",
                                    label: "Card View",
                                    icon: <LayoutGrid size={20} />,
                                },
                                {
                                    value: "table",
                                    label: "Table View",
                                    icon: <LayoutList size={20} />,
                                },
                            ]}
                        />
                        <div style={{ display: "flex", gap: "1rem" }}>
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
                        <AddNewOwnerButton />
                       </div>

                    </div>

                    <ToggleButton.Content>
                        <div
                            className="LEADSfilter"
                            style={{
                                padding: "1.5rem",
                                borderTop: "1px solid #eee",
                                backgroundColor: "transparent",
                                marginTop: "1rem",
                            }}
                        >
                            <NewOwnerFilters />
                        </div>
                    </ToggleButton.Content>
                </ToggleButton>

                {renderView()}
            </section>
            <ScrollToTop containerRef={containerRef} />
        </div>
    );
}

export default NewOwnersList;
