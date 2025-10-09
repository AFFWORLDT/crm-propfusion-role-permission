import React, { useState } from "react";
import SectionTop from "../ui/SectionTop";
import TabBar from "../ui/TabBar";
import { KPI_CONTRACTS_TABS } from "../utils/constants";
import AgentSelector from "../components/AgentSelector";
import AgentWalletBalance from "../components/AgentWalletBalance";
import AgentWalletTransactions from "../components/AgentWalletTransactions";
import { User } from "lucide-react";
import styles from "./ledger.module.css";

function Ledger() {
    const [selectedAgent, setSelectedAgent] = useState(null);

    const handleAgentChange = (agent) => {
        setSelectedAgent(agent);
    };

    return (
        <div className="sectionContainer">
            <SectionTop>
                <TabBar
                    tabs={KPI_CONTRACTS_TABS}
                    activeTab={"LEDGER"}
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
                <div className={styles.content}>
                    {/* Agent Selection */}
                    <AgentSelector
                        selectedAgent={selectedAgent}
                        onAgentChange={handleAgentChange}
                    />

                    {/* Agent Details and Wallet Balance Row */}
                    {selectedAgent && (
                        <div className={styles.agentRow}>
                            <div className={styles.agentDetails}>
                                <div className={styles.agentCard}>
                                    <div className={styles.agentHeader}>
                                        <div className={styles.agentAvatar}>
                                            {selectedAgent.avatar ? (
                                                <img
                                                    src={selectedAgent.avatar}
                                                    alt={selectedAgent.name}
                                                    className={
                                                        styles.avatarImage
                                                    }
                                                />
                                            ) : (
                                                <div
                                                    className={
                                                        styles.avatarPlaceholder
                                                    }
                                                >
                                                    <User />
                                                </div>
                                            )}
                                        </div>
                                        <div className={styles.agentInfo}>
                                            <h3>{selectedAgent.name}</h3>
                                            <p className={styles.agentEmail}>
                                                {selectedAgent.email}
                                            </p>
                                            <p className={styles.agentId}>
                                                Agent ID: {selectedAgent.id}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={styles.agentDetailsGrid}>
                                        <div className={styles.detailItem}>
                                            <span
                                                className={styles.detailLabel}
                                            >
                                                Phone:
                                            </span>
                                            <span
                                                className={styles.detailValue}
                                            >
                                                {selectedAgent.phone || "N/A"}
                                            </span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span
                                                className={styles.detailLabel}
                                            >
                                                Experience:
                                            </span>
                                            <span
                                                className={styles.detailValue}
                                            >
                                                {selectedAgent.experience_years ||
                                                    0}{" "}
                                                years
                                            </span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span
                                                className={styles.detailLabel}
                                            >
                                                Gender:
                                            </span>
                                            <span
                                                className={styles.detailValue}
                                            >
                                                {selectedAgent.gender || "N/A"}
                                            </span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span
                                                className={styles.detailLabel}
                                            >
                                                Status:
                                            </span>
                                            <span
                                                className={`${styles.statusBadge} ${selectedAgent.state === "active" ? styles.active : styles.inactive}`}
                                            >
                                                {selectedAgent.state || "N/A"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.walletSection}>
                                <AgentWalletBalance
                                    selectedAgent={selectedAgent}
                                />
                            </div>
                        </div>
                    )}

                    {/* Agent Wallet Transactions Section */}
                    <AgentWalletTransactions selectedAgent={selectedAgent} />
                </div>
            </section>
        </div>
    );
}

export default Ledger;
