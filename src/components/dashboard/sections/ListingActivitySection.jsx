import styles from "../../../pages/Dashboard.module.css";
import LineChart from "../charts/LineChart";
import DonutChart from "../charts/DonutChart";
import ChartHeader from "../ChartHeader";
import { chartTheme, prepareCSVData } from "../utils/chartUtils";

function ListingActivitySection({ resultArray, propertyTypeData }) {
    const dailyListingsCSVData = prepareCSVData(
        resultArray.map(item => ({ Date: item.date, Listings: item.listings })),
        "Daily Listings"
    );
    
    const propertyTypesCSVData = prepareCSVData(
        propertyTypeData.map(item => ({ Type: item.type, Count: item.value })),
        "Property Types"
    );

    return (
        <div className={styles.dashboardForPropertyReport}>
            <div className={styles.propertyStatesCard}>
                <ChartHeader 
                    title="Listing Activity Overview" 
                    csvData={dailyListingsCSVData} 
                />
                <div className={styles.listingOverViewComponent}>
                    <LineChart 
                        data={resultArray} 
                        chartTheme={chartTheme} 
                    />
                </div>
            </div>

            {/* Property Types */}
            <div className={styles.propertyStatesCard}>
                <ChartHeader 
                    title="Property Types" 
                    csvData={propertyTypesCSVData} 
                />
                <div>
                    <DonutChart 
                        data={propertyTypeData} 
                        chartTheme={chartTheme} 
                    />
                </div>
            </div>
        </div>
    );
}

export default ListingActivitySection; 