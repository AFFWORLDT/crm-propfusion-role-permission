import SectionTop from "../../ui/SectionTop";
import SubscriptionContainer from "../../features/admin/general/SubscriptionContainer";
import TabBar from "../../ui/TabBar";
import { SUBSCRIPTION_TABS } from "../../utils/constants";

function Subscription() {
    return (
        <div className="sectionContainer">
            <SectionTop heading="Subscription">
                <TabBar
                    tabs={SUBSCRIPTION_TABS}
                    activeTab={"SUBSCRIPTION"}
                    navigateTo={(id) => SUBSCRIPTION_TABS.find(tab => tab.id === id)?.path || '/admin/general/subscription'}
                />
            </SectionTop>
            <section className="sectionStyles" style={{ backgroundColor: SUBSCRIPTION_TABS[0].bgColor }}>
                <div className="sectionDiv">
                    <SubscriptionContainer />
                </div>
            </section>
        </div>
    );
}

export default Subscription;
