import ContactList from "../features/contacts/ContactList";
import SectionTop from "../ui/SectionTop";
import TabBar from "../ui/TabBar";
import { KPI_CONTRACTS_TABS } from "../utils/constants";

function Contacts() {
    return (
        <div className="sectionContainer">
            <SectionTop>
                <TabBar
                    tabs={KPI_CONTRACTS_TABS}
                    activeTab={"CONTACTS"}
                    navigateTo={(tabId) => {
                        if (tabId === "VIEWINGS") {
                            return "/viewings";
                        }
                        if (tabId === "TRANSACTIONS") {
                            return "/transactions";
                        }
                        if (tabId === "KPI_SUBMISSIONS") {
                            return "/kpi-submissions?viewType=table";
                        }
                        return `/contacts`;
                    }}
                />
            </SectionTop>
            <section className="sectionStyles">
                <ContactList />
            </section>
        </div>
    );
}

export default Contacts;
