import SectionTop from "../../ui/SectionTop";
import ExtraFilters from "../../ui/ExtraFilters";
import NewPropertiesFilter from "../../features/properties/NewPropertiesFilter";
import NewProperties from "../../features/properties/NewProperties";
import Tags from "../../features/tags/Tags";
import MultiSelectAction from "../../ui/MultiSelectAction";
import { useSelectedProperties } from "../../context/SelectedPropertiesContext";
import NewPropertyInTable from "../../features/properties/NewPropertyInTable";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDefaultSetting } from "../../store/defaultSettingStore";
import ToggleButton from "../../ui/ToggleButton";
import {
    Search,
    LayoutGrid,
    LayoutList,
    LayoutTemplate,
    MapPin,
    X,
} from "lucide-react";
import AddButtonToNavigateForms from "../../ui/AddButtonToNavigateForms";
import ViewToggleButton from "../../ui/ViewToggleButton";
import TabBar from "../../ui/TabBar";
import { LISTINGS_TABS_TYPE_OPTIONS_LIGHT } from "../../utils/constants";
import useInfiniteProperties from "../../features/properties/useInfiniteProperties";
import { useCallback, useRef, useEffect, useState } from "react";
import ScrollToTop from "../../ui/ScrollToTop";
import Filter from "../../ui/Filter";
import useStaff from "../../features/admin/staff/useStaff";
import SellPropertyInteractive from "../../features/properties/SellPropertyInteractive";
import RentPropertyInteractive from "../../features/properties/RentPropertyInteractive";
import SellListingsMapView from "../../features/properties/SellListingsMapView";
import usePropertiesAll from "../../features/properties/usePropertiesAll";
import { getLocationWihLocationType } from "../../services/apiLocations";
import { formatLocationsCommunityOptionsForProperties } from "../../utils/utils";
import { useMyPermissions } from "../../hooks/useHasPermission";
import PageNotFound from "../PageNotFound";
import SimpleTabs from "../../ui/SimpleTabs";
import useAllDetails from "../../features/all-details/useAllDetails";
import styles from "../../styles/NewPropertiesList.module.css";
import useImagesStore from "../../store/imagesStore";

function NewPropertiesList({ listingType }) {
    const { data } = useAllDetails();
    const navigate = useNavigate();
    const { clearAllImages } = useImagesStore();
    const [localListingType, setLocalListingType] = useState(listingType);
    const {
        properties,
        isLoading,
        error,
        totalSize,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteProperties(localListingType);

    const {
        properties: allProperties,
        isLoading: isAllPropertiesLoading,
        error: allPropertiesError,
    } = usePropertiesAll(localListingType);
    // State to hold filtered properties by building ID

    const [searchParams, setSearchParams] = useSearchParams();
    const viewType =
        searchParams.get("viewType") ??
        data?.current_user_details?.property_default_view ??
        "table";
    const { showCheckboxes, handleMultiSelect } = useSelectedProperties();
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

    useEffect(() => {
        if (data?.current_user_details?.property_default_view) {
            setSearchParams({
                viewType: data.current_user_details.property_default_view,
            });
        }
    }, []);

    const currentTab = LISTINGS_TABS_TYPE_OPTIONS_LIGHT.find(
        (tab) => tab.id === listingType
    );
    const bgColor = currentTab?.bgColor || "#ffffff"; // Default to white if no match
    const { data: agentData, isLoading: isAgentLoading } = useStaff();
    const agentOptions = agentData.map((item) => {
        return { value: item.id, label: item.name };
    });

    // // Determine which properties to display (filtered or regular)
    // const displayProperties = buildingIdFilterActive ? filteredProperties : properties;
    // const displayTotalSize = buildingIdFilterActive ? (filteredProperties?.length || 0) : totalSize;

    if (!hasPermission("view_properties")) {
        return <PageNotFound />;
    }

    const handleTabChange = (newType) => {
        setLocalListingType(newType);
    };

    const handleNavigate = () => {
        if (localListingType === "ALL") {
            clearAllImages();
            navigate(`/for-sell/add`);
        } else {
            clearAllImages();
            navigate(`/for-${localListingType.toLowerCase()}/add`);
        }
    };

    return (
        <div className="sectionContainer">
            <SectionTop
                heading={`${listingType[0] + listingType.toLowerCase().slice(1)} List`}
            >
                <SimpleTabs
                    tabs={[
                        {
                            id: "SELL",
                            label: "Sell Listings",
                            bgColor: "#f5f5f5",
                        },
                        {
                            id: "RENT",
                            label: "Rent Listings",
                            bgColor: "#f5f5f5",
                        },

                        { id: "", label: "All Listings", bgColor: "#f5f5f5" },
                    ]}
                    activeTab={localListingType}
                    onTabChange={handleTabChange}
                    isLoading={isLoading}
                />
            </SectionTop>
            <section
                ref={containerRef}
                className="sectionStyles"
                style={{
                    paddingTop: "4rem",
                    paddingLeft: "3rem",
                    backgroundColor: bgColor,
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
                    <ToggleButton mobileModal={true}>
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
                                buttonOptions={[
                                    { label: "Active", value: "ACTIVE" },
                                    { label: "Inactive", value: "INACTIVE" },
                                    {
                                        label: `${listingType === "RENT" ? "Rented" : "Sold"}`,
                                        value: `${listingType === "RENT" ? "RENTED" : "SOLD"}`,
                                    },
                                    {
                                        label: "Draft",
                                        value: `DRAFT`,
                                    },
                                ]}
                                totalSize={totalSize}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                    flexWrap: "wrap",
                                }}
                            >
                                <Filter
                                    showReset={false}
                                    smallHandleResetBtn={true}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "1rem",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <Filter.InputAsyncDataList
                                            registerName="community"
                                            placeholder="Community"
                                            asyncFunc={(search) =>
                                                getLocationWihLocationType(
                                                    search,
                                                    "community"
                                                )
                                            }
                                            formatFunc={
                                                formatLocationsCommunityOptionsForProperties
                                            }
                                        />
                                        <Filter.InputDataList
                                            registerName="agent_id"
                                            placeholder="Agent"
                                            data={agentOptions}
                                            isLoading={isAgentLoading}
                                        />
                                    </div>
                                </Filter>
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
                                            marginBottom: "0rem",
                                        }}
                                    />
                                    {/* <AddButtonToNavigateForms /> */}
                                    <div>
                                        <button
                                            onClick={handleNavigate}
                                            type="button"
                                            style={{
                                                backgroundColor:
                                                    data?.company_settings
                                                        ?.sidebar_color_code ||
                                                    "#020079",
                                                border: "1px solid #000",
                                                borderRadius: "0.5rem",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.25rem",
                                                color: "#fff",
                                                padding: "0.7rem 1rem",
                                                width: "100%",
                                            }}
                                            className={`btnNormalSmall ${styles.addPropertyButtonResponsive}`}
                                        >
                                            <span>+</span>
                                            <span>Add {localListingType}</span>
                                        </button>
                                    </div>
                                </div>
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
                                        {
                                            value: "interactive",
                                            label: "Interactive View",
                                            icon: <LayoutTemplate size={20} />,
                                        },
                                        {
                                            value: "map",
                                            label: "Map View",
                                            icon: <MapPin size={20} />,
                                        },
                                    ]}
                                />
                            </div>
                        </div>
                        <ToggleButton.Content>
                            {({ toggle, isMobile }) => (
                                <div
                                    className="LEADSfilter"
                                    style={{
                                        padding: "1rem",
                                        backgroundColor: "transparent",
                                    }}
                                >
                                    {isMobile && (
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginBottom: "1rem",
                                            }}
                                        >
                                            <h3>Filter</h3>
                                            <button onClick={toggle}>
                                                <X />
                                            </button>
                                        </div>
                                    )}
                                    <NewPropertiesFilter
                                        localListingType={localListingType}
                                    />
                                </div>
                            )}
                        </ToggleButton.Content>
                    </ToggleButton>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Tags tagType="properties" />
                        <MultiSelectAction
                            onClick={handleMultiSelect}
                            showCheckboxes={showCheckboxes}
                            listingType={localListingType}
                        />
                    </div>

                    {viewType === "interactive" &&
                    localListingType === "SELL" ? (
                        <SellPropertyInteractive
                            isLoading={isLoading}
                            error={error}
                            data={properties}
                            isFetchingNextPage={isFetchingNextPage}
                        />
                    ) : viewType === "interactive" &&
                      localListingType === "RENT" ? (
                        <RentPropertyInteractive
                            isLoading={isLoading}
                            error={error}
                            data={properties}
                            isFetchingNextPage={isFetchingNextPage}
                        />
                    ) : viewType === "map" ? (
                        <SellListingsMapView
                            properties={allProperties
                                ?.filter((p) => p?.location)
                                ?.map((p) => ({
                                    id: p.id,
                                    title: p.name,
                                    location: {
                                        latitude: p?.location?.latitude,
                                        longitude: p?.location?.longitude,
                                        city: p?.location?.city,
                                        community: p?.location?.sub_community,
                                    },
                                    property_type: p.propertyTypes?.join(", "),
                                    price: p.newParam?.price,
                                    agent: p.agent
                                        ? {
                                              name: p.agent.name,
                                              avatar: p.agent.avatar,
                                          }
                                        : null,
                                    photos: p.photos || [],
                                    area: p.area?.name,
                                    areaLocation: p.area?.position
                                        ? p.area.position.split(",").map(Number)
                                        : [],
                                    developer: p.developer,
                                    handover: p.newParam?.handoverTime,
                                    bedrooms: `${p.newParam?.bedroomMin} - ${p.newParam?.bedroomMax}`,
                                    size: `${p.newParam?.size_min} - ${p.newParam?.size_max} sq.ft`,
                                }))}
                            isLoading={isAllPropertiesLoading}
                            error={allPropertiesError}
                        />
                    ) : viewType === "card" ? (
                        <NewProperties
                            listingType={localListingType}
                            isLoading={isLoading}
                            error={error}
                            data={properties}
                            totalSize={totalSize}
                            showCheckboxes={showCheckboxes}
                            fetchNextPage={fetchNextPage}
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                        />
                    ) : (
                        <NewPropertyInTable
                            listingType={localListingType}
                            isLoading={isLoading}
                            error={error}
                            data={properties}
                            totalSize={totalSize}
                            showCheckboxes={showCheckboxes}
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

export default NewPropertiesList;
