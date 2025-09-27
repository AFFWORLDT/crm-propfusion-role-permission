import SectionTop from "../../ui/SectionTop";
import Filter from "../../ui/Filter";
import ManageAreasGrid from "../../features/admin/general/ManageAreasGrid";
import AddArea from "../../features/areas/AddArea";
import TabBar from "../../ui/TabBar";
import { MANAGE_AREAS_TABS } from "../../utils/constants";
import { useMyPermissions } from "../../hooks/useHasPermission";

function ManageAreas() {
    const { hasPermission } = useMyPermissions();
    return (
        <div className="sectionContainer">
            <SectionTop heading="Manage Areas">
                <TabBar
                    tabs={MANAGE_AREAS_TABS}
                    activeTab={"MANAGE_AREAS"}
                    navigateTo={(id) =>
                        MANAGE_AREAS_TABS.find((tab) => tab.id === id)?.path ||
                        "/admin/general/manage-areas"
                    }
                />
            </SectionTop>
            <section
                className="sectionStyles"
                style={{ backgroundColor: MANAGE_AREAS_TABS[0].bgColor }}
            >
                <div className="sectionDiv">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "2rem",
                        }}
                    >
                        <Filter>
                            <Filter.Input
                                registerName="name"
                                placeholder="Name"
                            />
                        </Filter>
                        {hasPermission("create_areas") && <AddArea />}
                    </div>
                    <ManageAreasGrid />
                </div>
            </section>
        </div>
    );
}

export default ManageAreas;
