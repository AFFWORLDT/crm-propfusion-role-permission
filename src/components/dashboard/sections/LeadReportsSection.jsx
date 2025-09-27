import styles from "../../../pages/Dashboard.module.css";
import { DashboardCard, DashboardChartCard } from "../DashboardCards";
import ChartHeader from "../ChartHeader";
import DonutChart from "../charts/DonutChart";
import HorizontalBarChart from "../charts/HorizontalBarChart";
import LineChart from "../charts/LineChart";
import { chartTheme, prepareCSVData } from "../utils/chartUtils";
import { Users } from "lucide-react";

function mapObjectToChartData(obj, labelKey = "type", valueKey = "value") {
  return Object.entries(obj || {}).map(([k, v]) => ({ [labelKey]: k, [valueKey]: v }));
}

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

function LeadReportsSection({ report }) {
  const summary = report?.summary || {};

  const totalLeads = summary?.total_leads ?? report?.total ?? 0;
  const statusRaw = mapObjectToChartData(summary?.status_breakdown);
  const sourceRaw = mapObjectToChartData(summary?.source_breakdown);
  const clientTypeRaw = mapObjectToChartData(summary?.client_type_breakdown);
  const propertyTypeData = mapObjectToChartData(summary?.property_type_breakdown).map(({ type, value }) => ({ name: type, count: value }));
  const communityData = mapObjectToChartData(summary?.community_breakdown).map(({ type, value }) => ({ name: type, count: value }));

  const statusColors = randomizeColors(statusRaw.length);
  const sourceColors = randomizeColors(sourceRaw.length);
  const clientTypeColors = randomizeColors(clientTypeRaw.length);

  const statusData = statusRaw.map((item, i) => ({ type: item.type, value: item.value, color: statusColors[i] }));
  const sourceData = sourceRaw.map((item, i) => ({ type: item.type, value: item.value, color: sourceColors[i] }));
  const clientTypeData = clientTypeRaw.map((item, i) => ({ type: item.type, value: item.value, color: clientTypeColors[i] }));

  const trendArray = Object.entries(summary?.time_trend || {}).map(([date, listings]) => ({ date, listings }));

  const agentRows = (report?.agent_lead_counts || []).slice(0, 10);

  return (
    <>
      <h2 className={styles.dashboardForPropertyReportHeader}>Lead Reports</h2>
      <div className={styles.dashboardForPropertyReport}>
        <div className={styles.dashboardGroup}>
          <DashboardCard icon={Users} label="Total Leads" value={totalLeads} />
          {statusData.length > 0 && (
            <DashboardChartCard>
              <ChartHeader title="Status Breakdown" csvData={prepareCSVData(statusData.map(i => ({ Status: i.type, Count: i.value })), "Status Breakdown")} />
              <DonutChart data={statusData} chartTheme={chartTheme} />
            </DashboardChartCard>
          )}
          {clientTypeData.length > 0 && (
            <DashboardChartCard>
              <ChartHeader title="Client Type" csvData={prepareCSVData(clientTypeData.map(i => ({ Type: i.type, Count: i.value })), "Client Type")}/>
              <DonutChart data={clientTypeData} chartTheme={chartTheme} legendPosition="bottom" />
            </DashboardChartCard>
          )}
        </div>

        <div className={styles.propertyStatesCard}>
          <ChartHeader title="Time Trend" csvData={prepareCSVData(trendArray.map(i => ({ Date: i.date, Leads: i.listings })), "Time Trend")} />
          <div className={styles.listingOverViewComponent}>
            <LineChart data={trendArray} chartTheme={chartTheme} color="#2563eb" />
          </div>
        </div>

        {sourceData.length > 0 && (
          <DashboardChartCard>
            <ChartHeader title="Sources" csvData={prepareCSVData(sourceData.map(i => ({ Source: i.type, Leads: i.value })), "Sources")} />
            <DonutChart data={sourceData} chartTheme={chartTheme} />
          </DashboardChartCard>
        )}

        {propertyTypeData.length > 0 && (
          <DashboardChartCard>
            <ChartHeader title="Property Types" csvData={prepareCSVData(propertyTypeData.map(i => ({ Type: i.name, Leads: i.count })), "Property Types")} />
            <HorizontalBarChart data={propertyTypeData} chartTheme={chartTheme} colors={randomizeColors(propertyTypeData.length)} />
          </DashboardChartCard>
        )}

        {communityData.length > 0 && (
          <DashboardChartCard>
            <ChartHeader title="Top Communities" csvData={prepareCSVData(communityData.map(i => ({ Community: i.name, Leads: i.count })), "Top Communities")} />
            <HorizontalBarChart data={communityData} chartTheme={chartTheme} colors={randomizeColors(communityData.length)} />
          </DashboardChartCard>
        )}

        {(agentRows?.length ?? 0) > 0 && (
          <div className={styles.propertyStatesCard}>
            <div className={styles.chartHeader}>
              <h3>Top Agents</h3>
            </div>
            <div className={styles.quickStats}>
              {agentRows.map((a) => (
                <div key={a.agent_id} className={styles.statCard} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={a.agent_avatar} alt={a.agent_name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600 }}>{a.agent_name}</span>
                    <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{a.lead_count} leads</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default LeadReportsSection;


