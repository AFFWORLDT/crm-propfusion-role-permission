import { useMemo } from "react";
import { motion } from "framer-motion";
import SectionTop from "../ui/SectionTop";
import styles from "./NewProjectsReport.module.css";
import TabBar from "../ui/TabBar";
import { DASHBAORDTABS } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useAllDetails from "../features/all-details/useAllDetails";
import { FaBuilding, FaChartBar, FaCalendar, FaMapMarkerAlt, FaIndustry, FaSwimmingPool, FaMoneyBillWave } from 'react-icons/fa';
import useProjectsReport from "../features/dashboard/useProjectsReport";
import { DashboardCard, DashboardChartCard } from "../components/dashboard/DashboardCards";
import DonutChart from "../components/dashboard/charts/DonutChart";
import HorizontalBarChart from "../components/dashboard/charts/HorizontalBarChart";
import LineChart from "../components/dashboard/charts/LineChart";
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

function formatPriceRange(range) {
  if (range === "0-1M") return "Under 1M";
  if (range === "1M-5M") return "1M - 5M";
  if (range === "5M-10M") return "5M - 10M";
  if (range === "10M-50M") return "10M - 50M";
  if (range === "50M+") return "50M+";
  return range;
}

const NewProjectsReport = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    
    const { data: allDetailsData } = useAllDetails();
    const currentUserDetails = allDetailsData?.current_user_details;
    
    // Filter dashboard tabs based on role_id 108
    const filteredDashboardTabs = useMemo(() => {
        if (currentUserDetails?.role_id === 108) {
            // Hide Agent Leads, Agent Properties, and New Projects Report for role_id 108
            return DASHBAORDTABS.filter(tab => 
                !['AgentLeads', 'AgentProperties', 'NewProjectsReport'].includes(tab.id)
            );
        }
        return DASHBAORDTABS;
    }, [currentUserDetails?.role_id]);

    const { data: report, isLoading, error } = useProjectsReport();

    const totalProjects = report?.total_projects || 0;
    const summary = report?.summary || {};

    // Process data for charts
    const statusData = useMemo(() => {
        const raw = mapObjectToChartData(summary.status_breakdown);
        const colors = randomizeColors(raw.length);
        return raw.map((item, i) => ({ 
            type: item.type, 
            value: item.value, 
            color: colors[i] 
        }));
    }, [summary.status_breakdown]);

    const propertyTypesData = useMemo(() => {
        const raw = mapObjectToChartData(summary.property_types_breakdown);
        const colors = randomizeColors(raw.length);
        return raw.map((item, i) => ({ 
            type: item.type, 
            value: item.value, 
            color: colors[i] 
        }));
    }, [summary.property_types_breakdown]);

    const postHandoverData = useMemo(() => {
        const raw = mapObjectToChartData(summary.post_handover_breakdown);
        const colors = randomizeColors(raw.length);
        return raw.map((item, i) => ({ 
            type: item.type === "True" ? "Post Handover" : "Pre Handover", 
            value: item.value, 
            color: colors[i] 
        }));
    }, [summary.post_handover_breakdown]);

    const poolTypeData = useMemo(() => {
        const raw = mapObjectToChartData(summary.pool_type_breakdown);
        const colors = randomizeColors(raw.length);
        return raw.map((item, i) => ({ 
            type: item.type, 
            value: item.value, 
            color: colors[i] 
        }));
    }, [summary.pool_type_breakdown]);

    const communityData = useMemo(() => {
        return mapObjectToChartData(summary.community_breakdown).map(({ type, value }) => ({ 
            name: type, 
            count: value 
        }));
    }, [summary.community_breakdown]);

    const developerData = useMemo(() => {
        return mapObjectToChartData(summary.developer_breakdown).map(({ type, value }) => ({ 
            name: type, 
            count: value 
        }));
    }, [summary.developer_breakdown]);

    const handoverYearData = useMemo(() => {
        return mapObjectToChartData(summary.handover_year_breakdown).map(({ type, value }) => ({ 
            name: type, 
            count: value 
        }));
    }, [summary.handover_year_breakdown]);

    const priceRangesData = useMemo(() => {
        return Object.entries(summary.price_ranges || {}).map(([range, data]) => ({
            name: formatPriceRange(range),
            count: data.count,
            totalValue: data.total_value,
            averageValue: data.average_value
        }));
    }, [summary.price_ranges]);

    const monthlyTrendData = useMemo(() => {
        const entries = Object.entries(summary.monthly_trend || {});
        return entries.map(([month, count]) => ({
            date: month, // LineChart expects 'date' property
            listings: count // LineChart expects 'listings' property
        })).sort((a, b) => a.date.localeCompare(b.date));
    }, [summary.monthly_trend]);

    // Calculate additional metrics
    const totalValue = useMemo(() => {
        return Object.values(summary.price_ranges || {}).reduce((sum, range) => sum + range.total_value, 0);
    }, [summary.price_ranges]);

    const averageProjectValue = useMemo(() => {
        return totalProjects > 0 ? Math.round(totalValue / totalProjects) : 0;
    }, [totalValue, totalProjects]);

    if (isLoading) {
        return (
            <div className="sectionContainer">
                <SectionTop>
                    <TabBar
                        activeTab="NewProjectsReport"
                        tabs={filteredDashboardTabs}
                        onTabClick={(tabId) => {
                            const tab = filteredDashboardTabs.find((t) => t.id === tabId);
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
                        Loading projects report data...
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
                        activeTab="NewProjectsReport"
                        tabs={filteredDashboardTabs}
                        onTabClick={(tabId) => {
                            const tab = filteredDashboardTabs.find((t) => t.id === tabId);
                            if (tab?.path) {
                                navigate(tab.path);
                            }
                        }}
                    />
                </SectionTop>
                <div className={styles.errorContainer}>
                    <div className={styles.errorMessage}>
                        <h3>Error Loading Data</h3>
                        <p>{error.message || "Failed to load projects report data. Please try again later."}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="sectionContainer">
            <SectionTop>
                <TabBar
                    activeTab="NewProjectsReport"
                    tabs={filteredDashboardTabs}
                    onTabClick={(tabId) => {
                        const tab = filteredDashboardTabs.find((t) => t.id === tabId);
                        if (tab?.path) {
                            navigate(tab.path);
                        }
                    }}
                />
            </SectionTop>
            <section className="sectionStyles" style={{ backgroundColor: "#ffffff" }}>
                <h2 className={styles.dashboardForPropertyReportHeader}>New Projects Report</h2>
                
                <div className={styles.dashboardForPropertyReport}>
                    <div className={styles.dashboardGroup}>
                        <DashboardCard icon={FaBuilding} label="Total Projects" value={totalProjects} />
                        <DashboardCard icon={FaMoneyBillWave} label="Total Value" value={`$${(totalValue / 1000000).toFixed(1)}M`} />
                        <DashboardCard icon={FaChartBar} label="Average Project Value" value={`$${(averageProjectValue / 1000).toFixed(0)}K`} />
                    </div>
                </div>

                <div className={styles.chartsSection}>
                    {/* First Row - Key Metrics */}
                    <div className={styles.chartsRow}>
                        {statusData.length > 0 && (
                            <div className={styles.chartCard}>
                                <h4>Project Status</h4>
                                <DonutChart data={statusData} chartTheme={chartTheme} />
                            </div>
                        )}
                        {propertyTypesData.length > 0 && (
                            <div className={styles.chartCard}>
                                <h4>Property Types</h4>
                                <DonutChart data={propertyTypesData} chartTheme={chartTheme} />
                            </div>
                        )}
                        {postHandoverData.length > 0 && (
                            <div className={styles.chartCard}>
                                <h4>Handover Status</h4>
                                <DonutChart data={postHandoverData} chartTheme={chartTheme} />
                            </div>
                        )}
                        {poolTypeData.length > 0 && (
                            <div className={styles.chartCard}>
                                <h4>Pool Types</h4>
                                <DonutChart data={poolTypeData} chartTheme={chartTheme} />
                            </div>
                        )}
                    </div>

                    {/* Second Row - Trends and Breakdowns */}
                    <div className={styles.chartsRow}>
                        {monthlyTrendData.length > 0 && (
                            <div className={styles.chartCard}>
                                <h4>Monthly Project Trends</h4>
                                <LineChart 
                                    data={monthlyTrendData} 
                                    chartTheme={chartTheme} 
                                />
                            </div>
                        )}
                        {priceRangesData.length > 0 && (
                            <div className={styles.chartCard}>
                                <h4>Price Ranges</h4>
                                <HorizontalBarChart 
                                    data={priceRangesData.map(item => ({ name: item.name, count: item.count }))} 
                                    chartTheme={chartTheme} 
                                    colors={randomizeColors(priceRangesData.length)} 
                                />
                            </div>
                        )}
                    </div>

                    {/* Third Row - Detailed Breakdowns */}
                    <div className={styles.chartsRow}>
                        {communityData.length > 0 && (
                            <div className={styles.chartCard}>
                                <h4>Communities</h4>
                                <HorizontalBarChart 
                                    data={communityData} 
                                    chartTheme={chartTheme} 
                                    colors={randomizeColors(communityData.length)} 
                                />
                            </div>
                        )}
                        {developerData.length > 0 && (
                            <div className={styles.chartCard}>
                                <h4>Developers</h4>
                                <HorizontalBarChart 
                                    data={developerData} 
                                    chartTheme={chartTheme} 
                                    colors={randomizeColors(developerData.length)} 
                                />
                            </div>
                        )}
                    </div>

                    {/* Fourth Row - Handover Years */}
                    <div className={styles.chartsRow}>
                        {handoverYearData.length > 0 && (
                            <div className={styles.chartCard}>
                                <h4>Handover Years</h4>
                                <HorizontalBarChart 
                                    data={handoverYearData} 
                                    chartTheme={chartTheme} 
                                    colors={randomizeColors(handoverYearData.length)} 
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default NewProjectsReport;
