import styles from "../../../pages/Dashboard.module.css";
import RadialBarChart from "../charts/RadialBarChart";
import DonutChart from "../charts/DonutChart";
import ChartHeader from "../ChartHeader";
import { chartTheme, prepareCSVData } from "../utils/chartUtils";

function LeadStatusSection({ leadStatusDistribution, LeadAgentTypeDistribution }) {
    return (
        <div className={styles.dashboardForPropertyReport}>
            <div className={styles.propertyStatesCard}>
                <ChartHeader 
                    title="Lead Status Distribution" 
                    csvData={prepareCSVData(
                        leadStatusDistribution.map(item => ({ Status: item.type, Count: item.value })),
                        "Lead Status Distribution"
                    )} 
                />
                <div className={styles.listingOverViewComponent}>
                    <RadialBarChart 
                        data={leadStatusDistribution} 
                        chartTheme={chartTheme} 
                    />
                </div>
            </div>

            {/* Lead Agent Type Distribution */}
            <div className={styles.propertyStatesCard}>
                <ChartHeader 
                    title="Lead Agent Type Distribution" 
                    csvData={prepareCSVData(
                        LeadAgentTypeDistribution.map(item => ({ Type: item.type, Count: item.value })),
                        "Lead Agent Type Distribution"
                    )} 
                />
                <div>
                    <DonutChart 
                        data={LeadAgentTypeDistribution} 
                        chartTheme={chartTheme} 
                    />
                </div>
            </div>
        </div>
    );
}

export default LeadStatusSection; 