import styles from "../../../pages/Dashboard.module.css";
import LineChart from "../charts/LineChart";
import DonutChart from "../charts/DonutChart";
import ChartHeader from "../ChartHeader";
import { chartTheme, prepareCSVData } from "../utils/chartUtils";

function LeadActivitySection({ resultLeadArray, leadTypeData     }) {
    // Prepare CSV data safely
    const dailyLeadsCSVData = resultLeadArray && resultLeadArray?.length > 0 
        ? prepareCSVData(
            resultLeadArray.map(item => ({ Date: item.date, Leads: item.listings })),
            "Daily Leads"
        ) 
        : null;
    
    const leadTypeCSVData = leadTypeData && leadTypeData?.length > 0
        ? prepareCSVData(
            leadTypeData.map(item => ({ Type: item.type, Value: item.value })),
            "Lead Client Types"
        )
        : null;

    return (
        <div className={styles.dashboardForPropertyReport}>
            <div className={styles.propertyStatesCard}>
                <ChartHeader 
                    title="Daily Leads" 
                    csvData={dailyLeadsCSVData} 
                />
                <div className={styles.listingOverViewComponent}>
                    <LineChart 
                        data={resultLeadArray || []} 
                        chartTheme={chartTheme}
                        color="#FF6B6B" 
                    />
                </div>
            </div>

            {/* Lead Client Types */}
            <div className={styles.propertyStatesCard}>
                <ChartHeader 
                    title="Lead Client Types" 
                    csvData={leadTypeCSVData} 
                />
                <div>
                    <DonutChart 
                        data={leadTypeData || []} 
                        chartTheme={chartTheme}
                        legendPosition="bottom" 
                    />
                </div>
            </div>
        </div>
    );
}

export default LeadActivitySection; 