import { BarChart2, Clock, AlertTriangle } from "lucide-react";
import styles from "../../../pages/Dashboard.module.css";
import { DashboardCard, DashboardChartCard } from "../DashboardCards";
import ChartHeader from "../ChartHeader";
import HorizontalBarChart from "../charts/HorizontalBarChart";
import { chartTheme, prepareCSVData } from "../utils/chartUtils";

function StageFollowupSection({ report }) {
  const toTitle = (key) =>
    key
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const iconByKey = {
    today_count: Clock,
    overdue_count: AlertTriangle,
    upcoming_count: BarChart2,
    total_stage_followups: BarChart2,
  };

  const summaryEntries = Object.entries(report || {})
    .filter(([key, value]) =>
      typeof value === "number" && (key.endsWith("_count") || key === "total_stage_followups")
    )
    .map(([key, value]) => {
      let label = toTitle(key);
      if (label.toLowerCase().endsWith(" count")) {
        label = label.slice(0, -6);
      }
      if (key === "total_stage_followups") label = "Total Lead's Stage Followups";
      if (key === "today_count") label = "Today's Scheduled Followups";
      if (key === "overdue_count") label = "Overdue Scheduled Followups";
      if (key === "upcoming_count") label = "Upcoming Scheduled Followups";
      const Icon = iconByKey[key] ?? BarChart2;
      return { key, label, value, Icon };
    });

  const leadsByStage = Object.entries(report?.leads_by_stage || {}).map(
    ([name, count]) => ({ name, count })
  );

  const leadTypeCharts = Object.entries(report?.stages_by_lead_type || {});

  return (
    <>
      <h2 className={styles.dashboardForPropertyReportHeader}>Leads Stages Report</h2>
      <div className={styles.dashboardForPropertyReport}>
        {summaryEntries.length > 0 && (
          <div className={styles.dashboardGroup}>
            {summaryEntries.map(({ key, label, value, Icon }) => (
              <DashboardCard key={key} icon={Icon} label={label} value={value} />
            ))}
          </div>
        )}

        <div className={styles.propertyStatesCard}>
          <ChartHeader
            title="Leads by Stage"
            csvData={prepareCSVData(leadsByStage, "Leads by Stage")}
          />
          <HorizontalBarChart data={leadsByStage} chartTheme={chartTheme} />
        </div>

        {leadTypeCharts.length > 0 && (
          <div className={styles.dashboardGroup}>
            {leadTypeCharts.map(([leadType, stagesObj]) => {
              const data = Object.entries(stagesObj || {}).map(([name, count]) => ({ name, count }));
              const title = `${leadType}: Stages`;
              return (
                <DashboardChartCard key={leadType}>
                  <ChartHeader title={title} csvData={prepareCSVData(data, title)} />
                  <HorizontalBarChart data={data} chartTheme={chartTheme} />
                </DashboardChartCard>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default StageFollowupSection;


