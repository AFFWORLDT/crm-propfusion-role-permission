import styles from "../../../pages/Dashboard.module.css";
import BarChart from "../charts/BarChart";
import HorizontalBarChart from "../charts/HorizontalBarChart";
import ChartHeader from "../ChartHeader";
import { chartTheme, prepareCSVData } from "../utils/chartUtils";

function PriceDistributionSection({ transformedData, portals }) {
    const priceDistributionCSVData = prepareCSVData(transformedData, "Price Distribution");

    return (
        <div className={styles.dashboardForPropertyReport}>
            <div className={styles.propertyStatesCard}>
                <ChartHeader 
                    title="Price Distribution" 
                    csvData={priceDistributionCSVData} 
                />
                <div
                    style={{
                        width: "100%",
                        height: "300px",
                    }}
                >
                    <BarChart 
                        data={transformedData} 
                        chartTheme={chartTheme} 
                    />
                </div>
            </div>

            {/* Portal Distribution */}
            <div className={styles.propertyStatesCard}>
                <ChartHeader 
                    title="Portal Distribution" 
                    csvData={prepareCSVData(portals, "Portal Distribution")} 
                />
                <HorizontalBarChart 
                    data={portals} 
                    chartTheme={chartTheme} 
                />
            </div>
        </div>
    );
}

export default PriceDistributionSection; 