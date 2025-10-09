import React from "react";
import SectionTop from "../ui/SectionTop";
import TabBar from "../ui/TabBar";
import { KPI_CONTRACTS_TABS } from "../utils/constants";
import PayoutListTable from "../components/PayoutListTable";

function PayoutList() {
    return (
        <div className="sectionContainer">
            <SectionTop>
                <TabBar
                    tabs={KPI_CONTRACTS_TABS}
                    activeTab={"PAYOUTLIST"}
                    navigateTo={(tabId) => {
                        if (tabId === "VIEWINGS") {
                            return "/viewings";
                        }
                        if (tabId === "CONTACTS") {
                            return "/contacts";
                        }
                        if (tabId === "TRANSACTIONS") {
                            return "/transactions";
                        }
                        
                        if (tabId === "LEDGER") {
                            return "/ledger";
                        }
                        if (tabId === "PAYOUTLIST") {
                            return "/payout-list";
                        }
                        if (tabId === "ALLTRANSACTIONS") {
                            return "/all-transactions";
                        }
                        if (tabId === "ALLAGENTWALLET") {
                            return "/all-agent-wallet";
                        }
                        return `/kpi-submissions`;
                    }}
                />
            </SectionTop>
            <section className="sectionStyles">
                <PayoutListTable />
            </section>
        </div>
    );
}

export default PayoutList;
