import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTop from "../ui/SectionTop";
import styles from "./AgentLeads.module.css";
import TabBar from "../ui/TabBar";
import { DASHBAORDTABS } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUsers, FaChartBar, FaEye } from 'react-icons/fa';
import useAgentLeadsReport from "../features/dashboard/useAgentLeadsReport";
import { DashboardCard, DashboardChartCard } from "../components/dashboard/DashboardCards";
import DonutChart from "../components/dashboard/charts/DonutChart";
import HorizontalBarChart from "../components/dashboard/charts/HorizontalBarChart";
import { chartTheme, prepareCSVData } from "../components/dashboard/utils/chartUtils";

const PALETTE = [
  "#4ECDC4", "#FF6B6B", "#FFB74D", "#A78BFA", "#F472B6", "#96C93D",
  "#45B7D1", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6"
];

function randomizeColors(length) {
  const shuffled = [...PALETTE].sort(() => Math.random() - 0.5);
  if (length <= shuffled.length) return shuffled.slice(0, length);
  const extended = [];
  while (extended.length < length) {
    extended.push(...shuffled);
  }
  return extended.slice(0, length);
}

function mapObjectToChartData(obj, labelKey = "type", valueKey = "value") {
  return Object.entries(obj || {}).map(([k, v]) => ({ [labelKey]: k, [valueKey]: v }));
}

const AgentLeads = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAgent, setSelectedAgent] = useState(null);

    const { data: report, isLoading, error } = useAgentLeadsReport();

    const agents = report?.data || [];
    const totalAgents = report?.total_agents || 0;

    const filteredAgents = useMemo(() => {
        if (!agents?.length) return [];

        return agents.filter((agent) => {
            const searchString = searchTerm.toLowerCase();
            return (
                (agent.agent_name?.toLowerCase() || "").includes(searchString) ||
                (agent.agent_email?.toLowerCase() || "").includes(searchString)
            );
        });
    }, [agents, searchTerm]);

    const totalLeads = useMemo(() => {
        return agents.reduce((sum, agent) => sum + (agent.total_leads || 0), 0);
    }, [agents]);

    if (isLoading) {
        return (
            <div className="sectionContainer">
                <SectionTop>
                    <TabBar
                        activeTab="AgentLeads"
                        tabs={DASHBAORDTABS}
                        onTabClick={(tabId) => {
                            const tab = DASHBAORDTABS.find((t) => t.id === tabId);
                            if (tab?.path) {
                                navigate(tab.path);
                            }
                        }}
                    />
                </SectionTop>
                <div className={styles.loaderContainer}>
                    <div className={styles.loader}>
                        <div className={styles.circle}></div>
                        <div className={styles.circle}></div>
                        <div className={styles.circle}></div>
                        <div className={styles.circle}></div>
                    </div>
                    <span className={styles.loaderText}>
                        Loading agent leads data...
                    </span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="sectionContainer">
                <SectionTop>
                    <TabBar
                        activeTab="AgentLeads"
                        tabs={DASHBAORDTABS}
                        onTabClick={(tabId) => {
                            const tab = DASHBAORDTABS.find((t) => t.id === tabId);
                            if (tab?.path) {
                                navigate(tab.path);
                            }
                        }}
                    />
                </SectionTop>
                <div className={styles.errorContainer}>
                    <div className={styles.errorMessage}>
                        <h3>Error Loading Data</h3>
                        <p>{error.message || "Failed to load agent leads data. Please try again later."}</p>
                    </div>
                </div>
            </div>
        );
    }

    const renderAgentCard = (agent) => {
        const statusRaw = mapObjectToChartData(agent.status_breakdown);
        const sourceRaw = mapObjectToChartData(agent.source_breakdown);
        const clientTypeRaw = mapObjectToChartData(agent.client_type_breakdown);
        
        const statusColors = randomizeColors(statusRaw.length);
        const sourceColors = randomizeColors(sourceRaw.length);
        const clientTypeColors = randomizeColors(clientTypeRaw.length);

        const statusData = statusRaw.map((item, i) => ({ 
            type: item.type, 
            value: item.value, 
            color: statusColors[i] 
        }));
        const sourceData = sourceRaw.map((item, i) => ({ 
            type: item.type, 
            value: item.value, 
            color: sourceColors[i] 
        }));
        const clientTypeData = clientTypeRaw.map((item, i) => ({ 
            type: item.type, 
            value: item.value, 
            color: clientTypeColors[i] 
        }));
        
        const propertyTypeData = mapObjectToChartData(agent.property_type_breakdown).map(({ type, value }) => ({ name: type, count: value }));
        const communityData = mapObjectToChartData(agent.community_breakdown).map(({ type, value }) => ({ name: type, count: value }));
        const groupData = mapObjectToChartData(agent.group_breakdown).map(({ type, value }) => ({ name: type, count: value }));
        const stageData = mapObjectToChartData(agent.stage_breakdown).map(({ type, value }) => ({ name: type, count: value }));
        const ratingData = mapObjectToChartData(agent.rating_breakdown).map(({ type, value }) => ({ name: type, count: value }));

        return (
            <motion.div
                key={agent.agent_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={styles.agentCard}
            >
                <div className={styles.agentHeader}>
                    <div className={styles.agentInfo}>
                        <div className={styles.avatarWrapper}>
                            {agent.agent_avatar ? (
                                <img src={agent.agent_avatar} alt={agent.agent_name} className={styles.avatar} />
                            ) : (
                                <div className={styles.avatarPlaceholder}>
                                    <span>{agent.agent_name?.charAt(0) || "?"}</span>
                                </div>
                            )}
                        </div>
                        <div className={styles.agentDetails}>
                            <h3 className={styles.agentName}>{agent.agent_name || "Unknown Agent"}</h3>
                            <p className={styles.agentEmail}>{agent.agent_email || "N/A"}</p>
                            <div className={styles.leadCount}>
                                <span className={styles.leadBadge}>{agent.total_leads} Total Leads</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setSelectedAgent(selectedAgent?.agent_id === agent.agent_id ? null : agent)}
                        className={styles.viewDetailsBtn}
                    >
                        <FaEye size={16} />
                        {selectedAgent?.agent_id === agent.agent_id ? 'Hide' : 'View'} Details
                    </button>
                </div>

                {selectedAgent?.agent_id === agent.agent_id && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={styles.agentDetailsExpanded}
                    >
                        <div className={styles.chartsGrid}>
                            {statusData.length > 0 && (
                                <div className={styles.chartCard}>
                                    <h4>Status Breakdown</h4>
                                    <DonutChart data={statusData} chartTheme={chartTheme} />
                                </div>
                            )}
                            {clientTypeData.length > 0 && (
                                <div className={styles.chartCard}>
                                    <h4>Client Types</h4>
                                    <DonutChart data={clientTypeData} chartTheme={chartTheme} />
                                </div>
                            )}
                            {sourceData.length > 0 && (
                                <div className={styles.chartCard}>
                                    <h4>Lead Sources</h4>
                                    <DonutChart data={sourceData} chartTheme={chartTheme} />
                                </div>
                            )}
                            {propertyTypeData.length > 0 && (
                                <div className={styles.chartCard}>
                                    <h4>Property Types</h4>
                                    <HorizontalBarChart data={propertyTypeData} chartTheme={chartTheme} colors={randomizeColors(propertyTypeData.length)} />
                                </div>
                            )}
                            {communityData.length > 0 && (
                                <div className={styles.chartCard}>
                                    <h4>Communities</h4>
                                    <HorizontalBarChart data={communityData} chartTheme={chartTheme} colors={randomizeColors(communityData.length)} />
                                </div>
                            )}
                            {groupData.length > 0 && (
                                <div className={styles.chartCard}>
                                    <h4>Groups</h4>
                                    <HorizontalBarChart data={groupData} chartTheme={chartTheme} colors={randomizeColors(groupData.length)} />
                                </div>
                            )}
                            {stageData.length > 0 && (
                                <div className={styles.chartCard}>
                                    <h4>Stages</h4>
                                    <HorizontalBarChart data={stageData} chartTheme={chartTheme} colors={randomizeColors(stageData.length)} />
                                </div>
                            )}
                            {ratingData.length > 0 && (
                                <div className={styles.chartCard}>
                                    <h4>Ratings</h4>
                                    <HorizontalBarChart data={ratingData} chartTheme={chartTheme} colors={randomizeColors(ratingData.length)} />
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        );
    };

    return (
        <div className="sectionContainer">
            <SectionTop>
                <TabBar
                    activeTab="AgentLeads"
                    tabs={DASHBAORDTABS}
                    onTabClick={(tabId) => {
                        const tab = DASHBAORDTABS.find((t) => t.id === tabId);
                        if (tab?.path) {
                            navigate(tab.path);
                        }
                    }}
                />
            </SectionTop>
            <section className="sectionStyles" style={{ backgroundColor: "#ffffff" }}>
                <h2 className={styles.dashboardForPropertyReportHeader}>Agent Leads Report</h2>
                
                <div className={styles.dashboardForPropertyReport}>
                    <div className={styles.dashboardGroup}>
                        <DashboardCard icon={FaUsers} label="Total Agents" value={totalAgents} />
                        <DashboardCard icon={FaChartBar} label="Total Leads" value={totalLeads} />
                    </div>
                </div>

                <div className={styles.searchSection}>
                    <div className={styles.searchWrapper}>
                        <FaSearch className={styles.searchIcon} />
                        <input
                            type="search"
                            placeholder="Search by agent name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    <div className={styles.resultsInfo}>
                        {filteredAgents.length} of {agents.length} agents
                        {searchTerm && ` matching "${searchTerm}"`}
                    </div>
                </div>

                <div className={styles.agentsGrid}>
                    <AnimatePresence>
                        {filteredAgents.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={styles.emptyState}
                            >
                                <FaSearch size={48} className={styles.emptyStateIcon} />
                                <h4 className={styles.emptyStateTitle}>
                                    {searchTerm ? `No agents found matching "${searchTerm}"` : "No agents available"}
                                </h4>
                                <p className={styles.emptyStateText}>
                                    {searchTerm ? "Try adjusting your search terms" : "There are no agents with lead data to display"}
                                </p>
                            </motion.div>
                        ) : (
                            filteredAgents.map(renderAgentCard)
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
};

export default AgentLeads;
