import { useCallback, useEffect, useRef } from "react";
import SectionTop from "../../ui/SectionTop";
import { toast } from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import useInfiniteVehicles from "../../features/vehicles/useInfiniteVehicles";
import Vehicles from "../../features/vehicles/Vehicles";
import ExtraFilters from "../../ui/ExtraFilters";
import VehiclesFilter from "../../features/vehicles/VehiclesFilter";
import Tags from "../../features/tags/Tags";
import { useSearchParams } from "react-router-dom";
import { useDefaultSetting } from "../../store/defaultSettingStore";
import ToggleButton from "../../ui/ToggleButton";
import { Search, LayoutGrid, LayoutList } from "lucide-react";
import AddButtonToNavigateForms from "../../ui/AddButtonToNavigateForms";
import ViewToggleButton from "../../ui/ViewToggleButton";
import ScrollToTop from "../../ui/ScrollToTop";
import TabBar from "../../ui/TabBar";
import { useMyPermissions } from "../../hooks/useHasPermission";
import PageNotFound from "../PageNotFound";

function VehiclesList({listingType}) {
    const {
        vehicles,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        totalSize,
    } = useInfiniteVehicles(listingType);

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    const [searchParams] = useSearchParams();
    const { view } = useDefaultSetting();
    const viewType = searchParams.get("viewType") ?? view;
    const containerRef = useRef(null);
    const { hasPermission } = useMyPermissions();

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

 

    if (isLoading) return <Spinner type={"fullPage"} />;

    if (!hasPermission("view_vehicles")) return <PageNotFound/>
    return (
        <div className="sectionContainer">
            <SectionTop heading={"Vehicles"}>
            <TabBar
                    tabs={[
                        {
                            id: "SELL",
                            label: "Sell",
                            bgColor: "#fbfbfe", // Extremely light purple
                            fontColor: "#341b80",
                            path: "/vehicles/for-sell",
                        },
                        {
                            id: "RENT",
                            label: "Rent",
                            bgColor: "#fbfdfc", // Extremely light green
                            fontColor: "#1a4731",
                            path: "/vehicles/for-rent",
                        },
                    ]}
                    activeTab={listingType}
                    navigateTo={(tabId) => {
                        return `/vehicles/for-${tabId.toLowerCase()}`;
                    }}
                />
            </SectionTop>

            <section
                ref={containerRef}
                className="sectionStyles"
                style={{
                    paddingTop: "4rem",
                    paddingLeft: "3rem",
                    backgroundColor: "#ffffff",
                    height: "calc(100vh)",
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
                            }}
                        >
                            <ExtraFilters
                                totalSize={totalSize}
                                buttonOptions={[
                                    { label: "Active", value: "ACTIVE" },
                                    { label: "Inactive", value: "INACTIVE" },
                                    { label: "Rented", value: "RENTED" },
                                    { label: "Draft", value: "DRAFT" },
                                    { label: "Completed", value: "COMPLETED" },
                                ]}
                            />
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
                                <AddButtonToNavigateForms />
                                <ViewToggleButton
                                    defaultView="card"
                                    viewParamName="viewType"
                                    viewOptions={[
                                        { value: "card", label: "Card View", icon: <LayoutGrid size={20} /> },
                                        { value: "table", label: "Table View", icon: <LayoutList size={20} /> },
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
                                <VehiclesFilter />
                            </div>
                        </ToggleButton.Content>
                    </ToggleButton>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Tags tagType="vehicles" />

                    </div>

                    <Vehicles
                        vehicles={vehicles}
                        isLoading={isLoading}
                        error={error}
                        fetchNextPage={fetchNextPage}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        viewType={viewType}
                    />
                </div>
            </section>
            <ScrollToTop containerRef={containerRef} />
        </div>
    );
}

export default VehiclesList;
