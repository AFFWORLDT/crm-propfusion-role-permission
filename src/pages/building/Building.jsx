import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import SectionTop from "../../ui/SectionTop";
import ToggleButton from "../../ui/ToggleButton";
import AddButtonToNavigateForms from "../../ui/AddButtonToNavigateForms";
import ViewToggleButton from "../../ui/ViewToggleButton";
import { LISTINGS_TABS_TYPE_OPTIONS_LIGHT } from "../../utils/constants";
import { useCallback, useRef, useEffect } from "react";
import ScrollToTop from "../../ui/ScrollToTop";
import useInfiniteBuilding from "../../features/building/useGetBuildUrl";
import NewBuilding from "../../features/building/NewBuildin";
import TableViewBuilding from "../../features/building/TableViewBuilding";
import ExtraFilters from "../../ui/ExtraFilters";
import BuildingFilters from "../../features/building/buildingFilters";

function Building() {
    const {
        projects,
        isLoading,
        error,
        totalSize,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteBuilding();
    const [searchParams] = useSearchParams();
    const viewType = searchParams.get("viewType") ?? "card";
    const containerRef = useRef(null);

    const timeoutRef = useRef(null);

    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new debounced timeout
        timeoutRef.current = setTimeout(() => {
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            const scrollThreshold = 100; // pixels from bottom to trigger load

            if (
                scrollHeight - (scrollTop + clientHeight) < scrollThreshold &&
                hasNextPage &&
                !isFetchingNextPage
            ) {
                fetchNextPage();
            }
        }, 200); // 200ms debounce delay
    }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener("scroll", handleScroll);

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
            // Clear timeout on cleanup
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [handleScroll]);

    // Find the matching tab to get the background color
    const currentTab = LISTINGS_TABS_TYPE_OPTIONS_LIGHT.find(
        (tab) => tab.id === "PROJECTS"
    );
    const bgColor = currentTab?.bgColor || "#ffffff"; // Default to white if no match

    return (
        <div className="sectionContainer">
            <SectionTop heading={`Building List`}></SectionTop>
            <section
                ref={containerRef}
                className="sectionStyles"
                style={{
                    paddingTop: "4rem",
                    paddingLeft: "3rem",
                    backgroundColor: bgColor,
                    height: "100%",
                    minHeight: "calc(100vh - 4rem)",
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                <style>
                    {`
                        .sectionStyles::-webkit-scrollbar {
                            display: none;
                        }
                    `}
                </style>
                <div className="">
                    <ToggleButton>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "1rem",
                                marginBottom: "1rem",
                                paddingTop: "4rem",
                                width: "100%"
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                    flexWrap: "wrap"
                                }}
                            >
                                <ExtraFilters
                                    buttonOptions={[
                                        { label: "Active", value: "ACTIVE" },
                                        {
                                            label: "Inactive",
                                            value: "INACTIVE",
                                        },
                                        {
                                            label: "Draft",
                                            value: `DRAFT`,
                                        },
                                    ]}
                                    totalSize={totalSize}
                                />
                                <ToggleButton.Button
                                    label="Advanced Filter"
                                    icon={<Search />}
                                    style={{
                                        border: "1px solid #000",
                                        backgroundColor: "transparent",
                                        color: "#000",
                                        padding: "0.5rem 1rem",
                                        borderRadius: "0.5rem",
                                    }}
                                />
                            </div>
                            <div style={{ display: "flex", gap: "1rem" }}>
                                <AddButtonToNavigateForms />
                                <ViewToggleButton
                                    defaultView="card"
                                    viewParamName="viewType"
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
                                    <BuildingFilters />
                            </div>
                        </ToggleButton.Content>
                    </ToggleButton>

                    {viewType === "card" ? (
                        <NewBuilding
                            isLoading={isLoading}
                            data={projects}
                            totalSize={totalSize}
                            error={error}
                            fetchNextPage={fetchNextPage}
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                        />
                    ) : (
                        <TableViewBuilding
                            isLoading={isLoading}
                            data={projects}
                            totalSize={totalSize}
                            error={error}
                            fetchNextPage={fetchNextPage}
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                        />
                    )}
                </div>
            </section>
            <ScrollToTop containerRef={containerRef} />
        </div>
    );
}

export default Building;
