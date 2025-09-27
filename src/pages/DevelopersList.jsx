import DeveloperGrid from "../features/developers/DeveloperGrid";
import SectionTop from "../ui/SectionTop";
import ChangeDeveloperAgents from "../features/developers/ChangeDeveloperAgents";
import DeveloperFilter from "../features/developers/DeveloperFilter";
import AddAgentIdInParams from "../ui/AddAgentIdInParams";
import TabBar from "../ui/TabBar";
import { AREA_DEVELOPER_TABS } from "../utils/constants";
import ToggleButton from "../ui/ToggleButton";
import { Search, LayoutGrid, LayoutList, LayoutTemplate } from "lucide-react";
import { useRef } from "react";
import ScrollToTop from "../ui/ScrollToTop";
import { useSearchParams } from "react-router-dom";
import ViewToggleButton from "../ui/ViewToggleButton";
import DeveloperInteractive from "../features/developers/DeveloperInteractive";
import DeveloperTable from "../features/developers/DeveloperTable";

function DevelopersList() {
    const [searchParams] = useSearchParams();
    const currentTab = AREA_DEVELOPER_TABS.find(
        (tab) => tab.id === "DEVELOPER"
    );
    const bgColor = currentTab?.bgColor || "#ffffff";
    const containerRef = useRef(null);
    const viewType = searchParams.get("viewType") ?? "grid";

    const viewOptions = [
        { value: "grid", label: "Grid View", icon: <LayoutGrid size={20} /> },
        { value: "table", label: "Table View", icon: <LayoutList size={20} /> },
        { value: "interactive", label: "Interactive View", icon: <LayoutTemplate size={20} /> }
    ];

    return (
        <div className="sectionContainer">
            <SectionTop heading="Developers List">
                <TabBar
                    tabs={AREA_DEVELOPER_TABS}
                    activeTab={"DEVELOPER"}
                    navigateTo={(tabId) => {
                        if (tabId === "AREA") {
                            return "/areas/list";
                        }
                        return `/developers/list?viewType=${viewType}`;
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
                    `}
                </style>
                <div>
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
                            <div></div>
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
                                    icon={<Search size={18} />}
                                    style={{
                                        "--toggleBtn-primary": "#000",
                                        border: "1px solid #000",
                                        backgroundColor: "transparent",
                                        padding: "0.6rem 1rem",
                                        borderRadius: "0.5rem",
                                        color: "#000",
                                    }}
                                />
                                <AddAgentIdInParams buttonName="My Developers" />
                                {<ChangeDeveloperAgents />}
                                <ViewToggleButton
                                    defaultView="grid"
                                    viewParamName="viewType"
                                    viewOptions={viewOptions}
                                />
                            </div>
                        </div>
                        <ToggleButton.Content>
                            <div
                                className="LEADSfilter"
                                style={{
                                    padding: "1.5rem",
                                    borderTop: "1px solid #eee",
                                    backgroundColor: "transparent !important",
                                }}
                            >
                                <DeveloperFilter />
                            </div>
                        </ToggleButton.Content>
                    </ToggleButton>

                    {viewType === "grid" && <DeveloperGrid containerRef={containerRef} />}
                    {viewType === "table" && <DeveloperTable containerRef={containerRef} />}
                    {viewType === "interactive" && <DeveloperInteractive containerRef={containerRef} />}
                </div>
            </section>
            <ScrollToTop containerRef={containerRef} />
        </div>
    );
}

export default DevelopersList;
