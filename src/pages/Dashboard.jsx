import { useEffect, lazy, Suspense, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./Dashboard.module.css";
import useDashboardStats from "../features/dashboard/useDashboardStats";
import { useAuth } from "../context/AuthContext";
import useAllDetails from "../features/all-details/useAllDetails";
// Permission checks removed - dashboard shows all content for all users

import SectionTop from "../ui/SectionTop";
import usePropertyReports from "../features/dashboard/usePropertyReports";
import useStageFollowupReport from "../features/dashboard/useStageFollowupReport";
import useLeadReportsSummary from "../features/dashboard/useLeadReportsSummary";

import TabBar from "../ui/TabBar";
import { DASHBAORDTABS } from "../utils/constants";
import LuxuryProfileActions from "../components/dashboard/LuxuryProfileActions";
import PremiumWalletBalance from "../components/dashboard/PremiumWalletBalance";
import PremiumAffiliateLink from "../components/dashboard/PremiumAffiliateLink";
import SocialMediaLinks from "../components/dashboard/SocialMediaLinks";

const DashboardSummary = lazy(
    () => import("../components/dashboard/sections/DashboardSummary")
);
const PropertyStatsSection = lazy(
    () => import("../components/dashboard/sections/PropertyStatsSection")
);
const ListingActivitySection = lazy(
    () => import("../components/dashboard/sections/ListingActivitySection")
);
const PriceDistributionSection = lazy(
    () => import("../components/dashboard/sections/PriceDistributionSection")
);
const LeadActivitySection = lazy(
    () => import("../components/dashboard/sections/LeadActivitySection")
);
const StageFollowupSection = lazy(
    () => import("../components/dashboard/sections/StageFollowupSection")
);
const LeadReportsSection = lazy(
    () => import("../components/dashboard/sections/LeadReportsSection")
);

const SectionLoader = () => (
    <div className={styles.sectionLoader}>
        <div className={styles.loader}>
            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
            <div className={styles.circle}></div>
        </div>
    </div>
);

function Dashboard() {
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
    
    // Dashboard shows all content for all users - no permission checks needed
    
    const { data, isLoading, error } = useDashboardStats();
    const { data: propertyReports } = usePropertyReports("property");
    const { data: leadReports } = usePropertyReports("lead");
    const { data: stageFollowupReport } = useStageFollowupReport();
    const { data: leadReportsSummary } = useLeadReportsSummary(1, 10);

    // Process data for charts
    const overviewData = propertyReports?.timeline?.daily_listings;
    const overviewLeadData = leadReports?.timeline?.daily_leads;

    const portalObject = propertyReports?.statistics?.portals || {};
    const portals = Object.entries(portalObject || {}).map(
        ([name, { enabled_count = 0, percentage = 0 }]) => ({
            name,
            count: enabled_count || 0,
            percentage: percentage || 0,
        })
    );

    const priceRanges = propertyReports?.statistics?.price_ranges || {};

    const leadTypeData = [
        {
            type: "Sell",
            value: leadReports?.statistics?.client_type_distribution?.SELL || 0,
            color: "#FF6B6B",
        },
        {
            type: "Rent",
            value: leadReports?.statistics?.client_type_distribution?.RENT || 0,
            color: "#4ECDC4",
        },
        {
            type: "Undefined",
            value:
                leadReports?.statistics?.client_type_distribution?.UNDEFINED ||
                0,
            color: "#95A5A6",
        },
    ];

    const transformedData = [
        {
            range: "0-100K",
            rent: priceRanges["RENT_0-100K"]?.count || 0,
            sale: priceRanges["SELL_0-100K"]?.count || 0,
        },
        {
            range: "100K-500K",
            rent: priceRanges["RENT_100K-500K"]?.count || 0,
            sale: priceRanges["SELL_100K-500K"]?.count || 0,
        },
        {
            range: "500K-1M",
            rent: priceRanges["RENT_500K-1M"]?.count || 0,
            sale: priceRanges["SELL_500K-1M"]?.count || 0,
        },
        {
            range: "1M-5M",
            rent: priceRanges["RENT_1M-5M"]?.count || 0,
            sale: priceRanges["SELL_1M-5M"]?.count || 0,
        },
        {
            range: "5M+",
            rent: priceRanges["RENT_5M+"]?.count || 0,
            sale: priceRanges["SELL_5M+"]?.count || 0,
        },
    ];

    const resultArray = overviewData
        ? Object.entries(overviewData || {})
              .map(([date, listings]) => ({ date, listings: listings || 0 }))
              .sort(
                  (a, b) =>
                      new Date(a.date).getTime() - new Date(b.date).getTime()
              )
        : [];

    const resultLeadArray = overviewLeadData
        ? Object.entries(overviewLeadData || {})
              .map(([date, listings]) => ({ date, listings: listings || 0 }))
              .sort(
                  (a, b) =>
                      new Date(a.date).getTime() - new Date(b.date).getTime()
              )
        : [];

    useEffect(() => {
        if (error) {
            toast.error("Failed to load dashboard data", {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
        }
    }, [error]);

    // Dashboard accessible to all users - no access restrictions

    const propertyTypeData = propertyReports?.statistics?.property_type
        ? [
              {
                  type: "Apartment",
                  value:
                      propertyReports.statistics.property_type.APARTMENT
                          ?.count || 0,
                  color: "#A78BFA",
              },
              {
                  type: "Villa",
                  value:
                      (propertyReports.statistics.property_type.VILLA?.count ||
                          0) +
                      (propertyReports.statistics.property_type.Villa?.count ||
                          0),
                  color: "#F472B6",
              },
              {
                  type: "Townhouse",
                  value:
                      propertyReports.statistics.property_type.TOWNHOUSE
                          ?.count || 0,
                  color: "#96C93D",
              },
              {
                  type: "Penthouse",
                  value:
                      propertyReports.statistics.property_type.PENTHOUSE
                          ?.count || 0,
                  color: "#FFB74D",
              },
              {
                  type: "Commercial",
                  value:
                      (propertyReports.statistics.property_type.RETAIL?.count ||
                          0) +
                      (propertyReports.statistics.property_type[
                          "COMMERCIAL PLOT"
                      ]?.count || 0),
                  color: "#4FC3F7",
              },
              {
                  type: "Compound",
                  value:
                      propertyReports.statistics.property_type.COMPOUND
                          ?.count || 0,
                  color: "#FF6B6B",
              },
              {
                  type: "Duplex",
                  value:
                      propertyReports.statistics.property_type.DUPLEX?.count ||
                      0,
                  color: "#5906a2",
              },
              {
                  type: "House",
                  value:
                      propertyReports.statistics.property_type.LAND?.count || 0,
                  color: "#ffd12b",
              },
              {
                  type: "H Apartment",
                  value:
                      propertyReports.statistics.property_type[
                          "HOTEL APARTMENT"
                      ]?.count || 0,
                  color: "#f94e48",
              },
              {
                  type: "Undefined",
                  value:
                      propertyReports.statistics.property_type.null?.count || 0,
                  color: "#95A5A6",
              },
          ]
        : [];

    const propertyLeadTypeDistribution = leadReports?.statistics
        ?.property_type_distribution
        ? [
              {
                  type: "Apartment",
                  value:
                      (leadReports?.statistics?.property_type_distribution
                          ?.APARTMENT || 0) +
                          (leadReports?.statistics?.property_type_distribution
                              ?.Apartment || 0) || 0,
                  color: "#A78BFA",
              },
              {
                  type: "Villa",
                  value:
                      (leadReports.statistics?.property_type_distribution
                          ?.VILLA || 0) +
                      (leadReports.statistics?.property_type_distribution
                          ?.Villa || 0),
                  color: "#F472B6",
              },
              {
                  type: "Townhouse",
                  value:
                      leadReports.statistics.property_type_distribution
                          ?.TOWNHOUSE || 0,
                  color: "#96C93D",
              },
              {
                  type: "Penthouse",
                  value:
                      leadReports.statistics.property_type_distribution
                          ?.PENTHOUSE || 0,
                  color: "#FFB74D",
              },
              {
                  type: "Commercial",
                  value:
                      (leadReports.statistics?.property_type_distribution
                          ?.RETAIL || 0) +
                      (leadReports.statistics?.property_type_distribution[
                          "COMMERCIAL PLOT"
                      ] || 0),
                  color: "#4FC3F7",
              },
              {
                  type: "Compound",
                  value:
                      leadReports.statistics?.property_type_distribution
                          ?.COMPOUND || 0,
                  color: "#FF6B6B",
              },
              {
                  type: "Duplex",
                  value:
                      leadReports.statistics?.property_type_distribution
                          ?.DUPLEX || 0,
                  color: "#5906a2",
              },
              {
                  type: "House",
                  value:
                      leadReports.statistics.property_type_distribution.LAND ||
                      0,
                  color: "#ffd12b",
              },
              {
                  type: "H Apartment",
                  value:
                      leadReports.statistics.property_type_distribution[
                          "HOTEL APARTMENT"
                      ] || 0,
                  color: "#f94e48",
              },
              {
                  type: "Undefined",
                  value:
                      (leadReports.statistics.property_type_distribution.null ||
                          0) +
                          leadReports.statistics.property_type_distribution[
                              ""
                          ] || 0,
                  color: "#95A5A6",
              },
              {
                  type: "Office Space",
                  value:
                      leadReports.statistics.property_type_distribution[
                          "Office Space"
                      ]?.count || 0,
                  color: "#ffd12b",
              },
              {
                  type: "Land",
                  value:
                      leadReports.statistics.property_type_distribution["Land"]
                          ?.count || 0,
                  color: "#f94e48",
              },
          ]
        : [];



    if (isLoading) {
        return (
            <div className="sectionContainer">
                <SectionTop>
                    <TabBar
                        activeTab="DASHBOARD"
                        tabs={filteredDashboardTabs}
                        onTabClick={(tabId) => {
                            const tab = filteredDashboardTabs.find(
                                (t) => t.id === tabId
                            );
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
                        Loading dashboard data...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="sectionContainer">
            <SectionTop>
                <TabBar
                    activeTab="DASHBOARD"
                    tabs={filteredDashboardTabs}
                    onTabClick={(tabId) => {
                        const tab = filteredDashboardTabs.find((t) => t.id === tabId);
                        if (tab?.path) {
                            navigate(tab.path);
                        }
                    }}
                />
            </SectionTop>
            <section
                className="sectionStyles"
                style={{
                    backgroundColor: "#ffffff",
                }}
            >
                {/* Luxury Profile Actions - Quick Access Tools */}
                <LuxuryProfileActions colorCode={allDetailsData?.company_settings?.sidebar_color_code || "#020079"} />
                
                {/* Social Media Links - Connect With Us */}
                <SocialMediaLinks />
                
                {/* Premium Wallet Balance - Financial Overview */}
                <PremiumWalletBalance colorCode={allDetailsData?.company_settings?.sidebar_color_code || "#020079"} />
                
                {/* Premium Affiliate Link - Network Growth */}
                <PremiumAffiliateLink colorCode={allDetailsData?.company_settings?.sidebar_color_code || "#020079"} />
                
                {/* Dashboard Summary - show for all users */}
                <Suspense fallback={<SectionLoader />}>
                    <DashboardSummary data={data || {}} />
                </Suspense>
                
                {/* Properties Section - show for all users */}
                <div style={{ marginBottom: '3rem' }}>
                    <h2 className={styles.dashboardForPropertyReportHeader}>Properties Overview</h2>
                        {propertyReports && (
                            <Suspense fallback={<SectionLoader />}>
                                <PropertyStatsSection
                                    propertyReports={propertyReports}
                                />
                            </Suspense>
                        )}
                    {resultArray &&
                        resultArray?.length > 0 &&
                        propertyTypeData &&
                        propertyTypeData?.length > 0 && (
                            <Suspense fallback={<SectionLoader />}>
                                <ListingActivitySection
                                    resultArray={resultArray}
                                    propertyTypeData={propertyTypeData}
                                />
                            </Suspense>
                        )}
                    {transformedData &&
                        transformedData?.length > 0 &&
                        portals &&
                        portals?.length > 0 && (
                            <Suspense fallback={<SectionLoader />}>
                                <PriceDistributionSection
                                    transformedData={transformedData}
                                    portals={portals}
                                />
                            </Suspense>
                        )}
                    </div>

                {/* Leads Section - show for all users */}
                <div style={{ marginBottom: '3rem' }}>
                    {leadReportsSummary && leadReportsSummary.summary && (
                        <Suspense fallback={<SectionLoader />}>
                            <LeadReportsSection report={leadReportsSummary} />
                        </Suspense>
                    )}
                {resultLeadArray &&
                    resultLeadArray?.length > 0 &&
                    leadTypeData &&
                    leadTypeData?.length > 0 && (
                        <Suspense fallback={<SectionLoader />}>
                            <LeadActivitySection
                                resultLeadArray={resultLeadArray}
                                leadTypeData={leadTypeData}
                                propertyLeadTypeDistribution={
                                    propertyLeadTypeDistribution || []
                                }
                            />
                        </Suspense>
                    )}
                    {stageFollowupReport && (
                        <Suspense fallback={<SectionLoader />}>
                            <StageFollowupSection report={stageFollowupReport} />
                        </Suspense>
                    )}
                </div>


            </section>
           
        </div>
    );
}



export default Dashboard;
