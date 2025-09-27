import SectionTop from "../../ui/SectionTop";
import GroupsInterFace from "../../features/admin/general/GroupsInterFace";
import StageInterFace from "../../features/admin/general/StageInterFace";
import TagInterFace from "../../features/admin/general/TagInterFace";
import StatusInterFace from "../../features/admin/general/StatusInterFace";
import RatingInterface from "../../features/admin/general/RatingInterface";
import TabBar from "../../ui/TabBar";
import { MANAGE_LEADS_INTERFACES_TABS } from "../../utils/constants";

export function ManageLeadsInterfaces() {
    return <div className="sectionContainer">
        <SectionTop heading="Manage Leads Interfaces">
            <TabBar
                tabs={MANAGE_LEADS_INTERFACES_TABS}
                activeTab={"MANAGE_LEADS_INTERFACES"}
                navigateTo={(id) => MANAGE_LEADS_INTERFACES_TABS.find(tab => tab.id === id)?.path || '/admin/general/manage-leads-interfaces'}
            />
        </SectionTop>
        <section className="sectionStyles" style={{ backgroundColor: MANAGE_LEADS_INTERFACES_TABS[0].bgColor }}>
            <div className="sectionDiv" style={{
                marginTop: "20px"
            }}>
                <GroupsInterFace />
            </div>
            <div className="sectionDiv" style={{
                marginTop: "20px"
            }}>
                <StageInterFace />
            </div>
            <div className="sectionDiv" style={{
                marginTop: "20px"
            }}>
                <TagInterFace />
            </div>
            <div className="sectionDiv" style={{
                marginTop: "20px"
            }}>
                <StatusInterFace />
            </div>
            <div className="sectionDiv" style={{
                marginTop: "20px"
            }}>
                <RatingInterface />
            </div>
        </section>
    </div>
}
