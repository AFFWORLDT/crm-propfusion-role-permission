import { Link, useSearchParams } from "react-router-dom";
import {
    Search,
    LayoutGrid,
    LayoutList,
    LayoutTemplate,
    Map as MapIcon,
    MapPin,
    X,
    Eye,
} from "lucide-react";
import NewProjects from "../../features/newProjects/NewProjects";
import NewProjectsFilter from "../../features/newProjects/NewProjectsFilter";
import NewProjectsInTable from "../../features/newProjects/NewProjectsInTable";
import NewProjectsInteractive from "../../features/newProjects/NewProjectsInteractive";
import useInfiniteProjects from "../../features/newProjects/useInfiniteProjects";
import ExtraFilters from "../../ui/ExtraFilters";
import SectionTop from "../../ui/SectionTop";
import ToggleButton from "../../ui/ToggleButton";
import AddButtonToNavigateForms from "../../ui/AddButtonToNavigateForms";
import ViewToggleButton from "../../ui/ViewToggleButton";
import TabBar from "../../ui/TabBar";
import { LISTINGS_TABS_TYPE_OPTIONS_LIGHT } from "../../utils/constants";
import { useCallback, useRef, useEffect, useState } from "react";
import ScrollToTop from "../../ui/ScrollToTop";
import Filter from "../../ui/Filter";
import useStaff from "../../features/admin/staff/useStaff";
import SellListingsMapView from "../../features/properties/SellListingsMapView";
import { getLocationWihLocationType } from "../../services/apiLocations";
import { formatLocationsCommunityOptionsForProperties } from "../../utils/utils";
import { useMyPermissions } from "../../hooks/useHasPermission";
import PageNotFound from "../PageNotFound";
import { syncAllProjects } from "../../services/apiNewProjects";
import toast from "react-hot-toast";
// Import the icons for sync button
import CachedIcon from "@mui/icons-material/Cached";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
// Import Material UI components
import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import useAllDetails from "../../features/all-details/useAllDetails";

function NewProjectList() {
    const { data } = useAllDetails();
    const {
        projects,
        isLoading,
        error,
        totalSize,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteProjects();
    const { hasPermission } = useMyPermissions();
    // const { currentUser } = useAuth();

    // if (currentUser && !roles.includes(currentUser.role))
    //     return <PageNotFound />;

    const [searchParams, setSearchParams] = useSearchParams();
    const viewType =
        searchParams.get("viewType") ??
        data?.current_user_details?.property_default_view ??
        "table";
    const containerRef = useRef(null);
    const [isSyncingAll, setIsSyncingAll] = useState(false);
    const [openSyncModal, setOpenSyncModal] = useState(false);
    useEffect(() => {
        if (data?.current_user_details?.property_default_view) {
            setSearchParams({
                viewType: data.current_user_details.property_default_view,
            });
        }
    }, []);
    // Add debounce timeout ref
    const timeoutRef = useRef(null);

    const handleScroll = useCallback(() => {
        if (!containerRef.current) return;

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new debounced timeout
        timeoutRef.current = setTimeout(() => {
            const { scrollTop, scrollHeight, clientHeight } =
                containerRef.current;

            if (
                scrollHeight - (scrollTop + clientHeight) <
                    scrollHeight * 0.2 &&
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

    async function handleSyncAll() {
        if (isSyncingAll) return;

        try {
            setIsSyncingAll(true);
            setOpenSyncModal(false);
            toast.loading("Syncing all projects. This may take a while...", {
                id: "syncAllProjects",
            });
            await syncAllProjects();
            toast.success("All projects synced successfully", {
                id: "syncAllProjects",
            });
        } catch (error) {
            toast.error(error.message || "Failed to sync all projects", {
                id: "syncAllProjects",
            });
        } finally {
            setIsSyncingAll(false);
        }
    }

    // Find the matching tab to get the background color
    const currentTab = LISTINGS_TABS_TYPE_OPTIONS_LIGHT.find(
        (tab) => tab.id === "PROJECTS"
    );
    const bgColor = currentTab?.bgColor || "#ffffff"; // Default to white if no match
    const { data: agentData, isLoading: isAgentLoading } = useStaff();

    const agentOptions = agentData.map((item) => {
        return { value: item.id, label: item.name };
    });

    const viewOptions = [
        { value: "card", label: "Card View", icon: <LayoutGrid size={20} /> },
        { value: "table", label: "Table View", icon: <LayoutList size={20} /> },
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
    ];
    if (!hasPermission("view_projects")) return <PageNotFound />;

    return (
        <div className="sectionContainer">
            <SectionTop heading={`New Project List`}>
                <TabBar
                    tabs={LISTINGS_TABS_TYPE_OPTIONS_LIGHT}
                    activeTab={"PROJECTS"}
                    navigateTo={(tabId) => {
                        if (tabId === "PROJECTS") {
                            return "/new-projects/list";
                        }
                        return `/for-${tabId.toLowerCase()}/new-list`;
                    }}
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
                        @keyframes spin {
                            from {
                                transform: rotate(0deg);
                            }
                            to {
                                transform: rotate(360deg);
                            }
                        }
                        .spin-animation {
                            animation: spin 1s linear infinite;
                            display: inline-block;
                        }
                        .sync-all-button {
                            background-color: #3787ff;
                            color: #fff;
                            padding: 0.8rem 1rem;
                            border-radius: 0.5rem;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 0.5rem;
                            border: none;
                            transition: all 0.2s ease;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

                        }
                        .sync-all-button:hover:not(:disabled) {
                            background-color: #0052cc;
                            transform: translateY(-1px);
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                        }
                        .sync-all-button:disabled {
                            opacity: 0.8;
                            cursor: wait;
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
                                    { label: "Sold Out", value: "SOLD" },
                                    { label: "New Launch", value: "POOL" },
                                ]}
                                totalSize={totalSize}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                    justifyContent: "flex-end",
                                    flexWrap: "wrap",
                                }}
                            >
                                <Filter showReset={false}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "1rem",
                                            justifyContent: "center",
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
                                <button
                                    className="sync-all-button"
                                    onClick={() => setOpenSyncModal(true)}
                                    disabled={isSyncingAll}
                                    title="Sync all projects data"
                                >
                                    {isSyncingAll ? (
                                        <span className="spin-animation">
                                            <RotateLeftIcon
                                                style={{
                                                    fontSize: "16px",
                                                    color: "#fff",
                                                }}
                                            />
                                        </span>
                                    ) : (
                                        <CachedIcon
                                            style={{
                                                fontSize: "16px",
                                                color: "#fff",
                                            }}
                                        />
                                    )}
                                    Sync All
                                </button>
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
                                    viewParamName="viewType"
                                    viewOptions={viewOptions}
                                />
                                <Link to={"/projectGarrery"}>
                                    <IconButton title="Show Gallary">
                                        <Eye />
                                    </IconButton>
                                </Link>
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
                                    <NewProjectsFilter />
                                </div>
                            )}
                        </ToggleButton.Content>
                    </ToggleButton>

                    {viewType === "card" ? (
                        <NewProjects
                            isLoading={isLoading}
                            data={projects}
                            totalSize={totalSize}
                            error={error}
                            fetchNextPage={fetchNextPage}
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                        />
                    ) : viewType === "table" ? (
                        <NewProjectsInTable
                            isLoading={isLoading}
                            data={projects}
                            totalSize={totalSize}
                            error={error}
                            fetchNextPage={fetchNextPage}
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                        />
                    ) : viewType === "map" ? (
                        <SellListingsMapView
                            properties={projects
                                ?.filter((p) => p?.location)
                                ?.map((p) => ({
                                    id: p.id,
                                    title: p.name,
                                    location: {
                                        latitude: p?.location?.latitude,
                                        longitude: p?.location?.longitude,
                                        city: p?.location?.city || "",
                                        community: p?.sub_community || "",
                                    },
                                    property_type:
                                        p.propertyTypes?.join(", ") || "",
                                    price: p.newParam?.price || "",
                                    agent: p.agent
                                        ? {
                                              name: p.agent.name,
                                              avatar: p.agent.avatar,
                                          }
                                        : null,
                                    photos: p.photos || [],
                                    area: p.area?.name || "",
                                    areaLocation: p.area?.position
                                        ? p.area.position.split(",").map(Number)
                                        : [],
                                    developer: p.developer || "",
                                    handover: p.newParam?.handoverTime || "",
                                    bedrooms: `${p.newParam?.bedroomMin || ""} - ${p.newParam?.bedroomMax || ""}`,
                                    size: `${p.newParam?.size_min || ""} - ${p.newParam?.size_max || ""} sq.ft`,
                                }))}
                        />
                    ) : (
                        <NewProjectsInteractive
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

            {/* Material UI Modal */}
            <Modal
                open={openSyncModal}
                onClose={() => setOpenSyncModal(false)}
                aria-labelledby="sync-all-projects-modal"
                aria-describedby="sync-all-projects-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography
                        id="sync-all-projects-modal"
                        variant="h6"
                        component="h2"
                        sx={{ mb: 1, fontSize: "1.5rem", fontWeight: "bold" }}
                    >
                        Sync All Projects
                    </Typography>
                    <Typography
                        id="sync-all-projects-description"
                        sx={{ mb: 3, fontSize: "1.1rem", fontWeight: "bold" }}
                    >
                        Are you sure you want to sync all projects? This
                        operation may take some time and will update all project
                        data from the master database.
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2,
                        }}
                    >
                        <Button
                            onClick={() => setOpenSyncModal(false)}
                            variant="outlined"
                            sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSyncAll}
                            variant="contained"
                            disabled={isSyncingAll}
                            sx={{
                                bgcolor: "#0066ff",
                                fontSize: "1.1rem",
                                fontWeight: "bold",
                            }}
                        >
                            {isSyncingAll ? "Syncing..." : "Sync All"}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}

export default NewProjectList;
