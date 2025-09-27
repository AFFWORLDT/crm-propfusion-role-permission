import ManageDevelopersGrid from "../../features/admin/general/ManageDevelopersGrid";
import AddDeveloper from "../../features/developers/AddDeveloper";
import Filter from "../../ui/Filter";
import SectionTop from "../../ui/SectionTop";
import TabBar from "../../ui/TabBar";
import { MANAGE_DEVELOPERS_TABS } from "../../utils/constants";

function ManageDevelopers() {
    return (
        <div className="sectionContainer">
            <SectionTop heading="Manage Developers">
                <TabBar
                    tabs={MANAGE_DEVELOPERS_TABS}
                    activeTab={"MANAGE_DEVELOPERS"}
                    navigateTo={(id) => MANAGE_DEVELOPERS_TABS.find(tab => tab.id === id)?.path || '/admin/general/manage-developers'}
                />
            </SectionTop>
            <section className="sectionStyles" style={{ backgroundColor: MANAGE_DEVELOPERS_TABS[0].bgColor }}>
                <div className="sectionDiv">
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "2rem",
                    }}>
                        <Filter>
                            <Filter.Input registerName="name" placeholder="Name" />
                        </Filter>
                        <AddDeveloper />
                    </div>
                    <ManageDevelopersGrid />
                </div>
            </section>
        </div>
    );
}

export default ManageDevelopers;
