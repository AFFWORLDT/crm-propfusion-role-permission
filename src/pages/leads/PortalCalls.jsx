import { useEffect, useRef } from "react";
import PortalCallsFilter from "../../features/leads/portalCalls/PortalCallsFilter";
import PortalCallsTable from "../../features/leads/portalCalls/PortalCallsTable";
import SectionTop from "../../ui/SectionTop";
import toast from "react-hot-toast";
import useInfinitePortalCalls from "../../features/leads/portalCalls/useInfinitePortalCalls";
// import { useAuth } from "../../context/AuthContext";
import { LEAD_TABS_TYPE_OPTIONS } from "../../utils/constants";
import TabBar from "../../ui/TabBar";
import ToggleButton from "../../ui/ToggleButton";
import { Search } from "lucide-react";
import ScrollToTop from "../../ui/ScrollToTop";

function PortalCalls() {
    const {
        isLoading,
        portalCalls,
        // totalSize, 
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfinitePortalCalls();
    // const { currentUser } = useAuth();
    const containerRef = useRef(null);

    const currentTab = LEAD_TABS_TYPE_OPTIONS.find(
        (tab) => tab.id === "PORTAL-CALLS"
    );
    const bgColor = currentTab?.bgColor || "#ffffff";

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    // if (currentUser?.role !== "admin") {
    //     return (
    //         <div className="sectionContainer">
    //             <SectionTop heading="Access Denied" />
    //         </div>
    //     );
    // }

    return (
        <div className="sectionContainer">
            <SectionTop heading={`Portal Calls`}>
                <TabBar
                    tabs={[
                        LEAD_TABS_TYPE_OPTIONS[3],
                        LEAD_TABS_TYPE_OPTIONS[4],
                        LEAD_TABS_TYPE_OPTIONS[5],
                        LEAD_TABS_TYPE_OPTIONS[6],
                        LEAD_TABS_TYPE_OPTIONS[7],
                    ]}
                    activeTab="PORTAL-CALLS"
                    navigateTo={(tabId) => `/leads/${tabId.toLowerCase()}`}
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
                <div>
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
                            <ToggleButton.Content position="up" fullWidth>
                                <div
                                    className="LEADSfilter"
                                    style={{ padding: "2.45rem" }}
                                >
                                    <PortalCallsFilter />
                                </div>
                            </ToggleButton.Content>
                        </div>
                    </ToggleButton>

                    <PortalCallsTable
                        data={portalCalls}
                        isLoading={isLoading}
                        containerRef={containerRef}
                        hasNextPage={hasNextPage}
                        fetchNextPage={fetchNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                    />
                </div>
            </section>
            <ScrollToTop containerRef={containerRef} />
        </div>
    );
}

export default PortalCalls;
