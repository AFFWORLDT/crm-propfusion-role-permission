import styles from "../../../pages/Dashboard.module.css";
import DonutChart from "../charts/DonutChart";
import ChartHeader from "../ChartHeader";
import { chartTheme, prepareCSVData } from "../utils/chartUtils";

function LeadSourceSection({ leadSourceDistribution, propertyLeadTypeDistribution }) {
    // Prepare CSV data safely
    const sourceCSVData = leadSourceDistribution && leadSourceDistribution.length > 0
        ? prepareCSVData(
            leadSourceDistribution.map(item => ({ Source: item.type, Count: item.value })),
            "Lead Source Distribution"
        )
        : null;
    
    const propertyTypeCSVData = propertyLeadTypeDistribution && propertyLeadTypeDistribution.length > 0
        ? prepareCSVData(
            propertyLeadTypeDistribution.map(item => ({ Type: item.type, Count: item.value })),
            "Lead Property Types"
        )
        : null;

    return (
        <div className={styles.dashboardForPropertyReport}>
            <div className={styles.propertyStatesCard}>
                <ChartHeader 
                    title="Source Distribution" 
                    csvData={sourceCSVData} 
                />
                <div className={styles.listingOverViewComponent}>
                    <DonutChart 
                        data={leadSourceDistribution || []} 
                        chartTheme={chartTheme} 
                    />
                </div>
            </div>

            {/* Lead Property Types */}
            <div className={styles.propertyStatesCard}>
                <ChartHeader 
                    title="Lead Property Types" 
                    csvData={propertyTypeCSVData} 
                />
                <div>
                    <DonutChart 
                        data={propertyLeadTypeDistribution || []} 
                        chartTheme={chartTheme}
                        legendPosition="bottom" 
                    />
                </div>
            </div>
        </div>
    );
}

export default LeadSourceSection; 