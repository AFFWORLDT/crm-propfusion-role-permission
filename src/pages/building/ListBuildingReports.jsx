import { useSearchParams, useNavigate } from "react-router-dom";
import SectionTop from "../../ui/SectionTop";
import ToggleButton from "../../ui/ToggleButton";
import { useCallback, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import ViewToggleButton from "../../ui/ViewToggleButton";
import useInfiniteBuilding from "../../features/building/useGetBuildUrl";
import BuildingFilters from "../../features/building/buildingFilters";
import AddButtonToNavigateForms from "../../ui/AddButtonToNavigateForms";
import BuildingReports from "./BuildingReports";
import BuildingReportsTable from "./BuildingReportsTable";
function ListBuildingReports() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const {
        projects,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isLoadingInfinite,
        error: errorInfinite,
    } = useInfiniteBuilding();
    const viewType = searchParams.get("viewType") || "card";
    const containerRef = useRef(null);
    const handlePaymentStatusChange = (status) => {
        const params = new URLSearchParams(searchParams);
        params.set("payment_status", status);
        navigate(`?${params.toString()}`);
    };
    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const scrollPercentage =
            (scrollTop / (scrollHeight - clientHeight)) * 100;

        if (scrollPercentage > 80 && hasNextPage && !isFetchingNextPage) {
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
    const containerHeight = projects?.length > 10 ? "100vh" : "auto";
    return (
        <div className="sectionContainer">
            <SectionTop heading={"Building Reports List"} />
            <section
                className="sectionStyles"
                ref={containerRef}
                style={{
                    paddingTop: "4rem",
                    paddingLeft: "3rem",
                    height: containerHeight,
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                <ToggleButton>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
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
                                justifyContent: "space-between",
                                width: "100%",
                            }}
                        >
                            <div className="filter-buttons">
                                <div className="button-group">
                                    <button
                                        onClick={() =>
                                            handlePaymentStatusChange("")
                                        }
                                        className={`filter-btn ${
                                            searchParams.get(
                                                "payment_status"
                                            ) === "all" ||
                                            !searchParams.get("payment_status")
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() =>
                                            handlePaymentStatusChange("pending")
                                        }
                                        className={`filter-btn ${
                                            searchParams.get(
                                                "payment_status"
                                            ) === "pending"
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        Pending
                                    </button>
                                    <button
                                        onClick={() =>
                                            handlePaymentStatusChange("done")
                                        }
                                        className={`filter-btn ${
                                            searchParams.get(
                                                "payment_status"
                                            ) === "done"
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                            <style>
                            {`
                                    .filter-buttons {
                                        margin: 1rem 0;
                                    }
                                    .button-group {
                                        display: inline-flex;
                                        background: #f1f5f9;
                                        padding: 0.5rem;
                                        border-radius: 0.75rem;
                                        gap: 0.5rem;
                                    }
                                    .filter-btn {
                                        padding: 0.75rem 1.5rem;
                                        border: none;
                                        background: transparent;
                                        color: #64748b;
                                        font-weight: 600;
                                        font-size: 1.25rem;
                                        border-radius: 0.5rem;
                                        transition: all 0.2s ease;
                                        cursor: pointer;
                                        min-width: 160px;
                                    }
                                    .filter-btn:hover {
                                        color: #0f172a;
                                    }
                                    .filter-btn.active {
                                        background: white;
                                        color: #0f172a;
                                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                                    }
                                    `}
                            </style>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "1rem",
                                    alignItems: "center",
                                }}
                            >
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

                                <AddButtonToNavigateForms />
                                <ViewToggleButton
                                    defaultView="card"
                                    viewParamName="viewType"
                                />
                            </div>
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
                    <BuildingReports
                        isLoading={isLoadingInfinite}
                        error={errorInfinite}
                        data={projects}
                        isFetchingNextPage={isFetchingNextPage}
                    />
                ) : (
                    <BuildingReportsTable
                        isLoading={isLoadingInfinite}
                        error={errorInfinite}
                        data={projects}
                        isFetchingNextPage={isFetchingNextPage}
                    />
                )}
            </section>
        </div>
    );
}

export default ListBuildingReports;
