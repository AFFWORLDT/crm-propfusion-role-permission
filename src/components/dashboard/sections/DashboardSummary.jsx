import { Activity, BarChart2, Phone, Users } from "lucide-react";
import styles from "./DashboardSummary.module.css";
import { DashboardCard, DashboardChartCard } from "../DashboardCards";
import PieChart from "../charts/PieChart";
import { chartTheme, prepareCSVData } from "../utils/chartUtils";
import ChartHeader from "../ChartHeader";
import HorizontalBarChart from "../charts/HorizontalBarChart";
import { useTranslation } from "react-i18next";

function DashboardSummary({ data }) {
  const { t } = useTranslation();

  const dataListings = [
    { name: t("dashboard.sell"), count: data?.listings?.sell || 0, color: "#4ECDC4" },
    { name: t("dashboard.rent"), count: data?.listings?.rent || 0, color: "#FF6B6B" },
    { name: t("dashboard.projects"), count: data?.listings?.projects || 0, color: "#96C93D" },
  ];

  const dataLeads = [
    { type: t("dashboard.sell"), value: data?.leads?.buy || 0, color: "#A78BFA" },
    { type: t("dashboard.rent"), value: data?.leads?.rent || 0, color: "#F472B6" },
  ];

  const listingsCSVData = prepareCSVData(
    dataListings.map((item) => ({ Type: item.name, Value: item.count })),
    t("dashboard.listingsDistribution")
  );

  const leadsCSVData = prepareCSVData(
    dataLeads.map((item) => ({ Type: item.type, Value: item.value })),
    t("dashboard.leadDistribution")
  );

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardGroup}>
        <DashboardCard
          icon={BarChart2}
          label={t("dashboard.totalListings")}
          value={data?.listings?.total || 0}
        />
        <DashboardCard
          icon={Activity}
          label={t("dashboard.totalLeads")}
          value={data?.leads?.total || 0}
        />
        <DashboardCard
          icon={Users}
          label={t("dashboard.activeDevelopers")}
          value={data?.developers || 0}
        />
      </div>

      <div className={styles.dashboardGroup}>
        <DashboardChartCard>
          <div className={styles.chartHeader}>
            <ChartHeader
              title={t("dashboard.listingsDistribution")}
              csvData={listingsCSVData}
            />
          </div>
          <HorizontalBarChart data={dataListings} chartTheme={chartTheme} />
        </DashboardChartCard>

        <DashboardChartCard>
          <div className={styles.chartHeader}>
            <ChartHeader
              title={t("dashboard.leadDistribution")}
              csvData={leadsCSVData}
            />
          </div>
          <PieChart data={dataLeads} chartTheme={chartTheme} />
        </DashboardChartCard>
      </div>
    </div>
  );
}

export default DashboardSummary;
