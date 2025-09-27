import { Building2, Home, DollarSign, Activity } from "lucide-react";
import styles from "../../../pages/Dashboard.module.css";
import { PropertyStatesCard } from "../DashboardCards";

function PropertyStatsSection({ propertyReports }) {
    return (
        <div className={styles.dashboardForPropertyReport}>
            <PropertyStatesCard
                icon={Building2}
                title={"Total Properties"}
                description={"Properties in database"}
                value={propertyReports?.total_properties || 0}
            />
            <PropertyStatesCard
                icon={Home}
                title={"For Rent"}
                description={`${propertyReports?.statistics?.listing_type?.RENT?.percentage || 0} % of total listings`}
                value={
                    propertyReports?.statistics?.listing_type?.RENT
                        ?.count || 0
                }
            />
            <PropertyStatesCard
                icon={DollarSign}
                title={"For Sale"}
                description={`${propertyReports?.statistics?.listing_type?.SELL?.percentage || 0} % of total listings`}
                value={
                    propertyReports?.statistics?.listing_type?.SELL
                        ?.count || 0
                }
            />
            <PropertyStatesCard
                icon={Activity}
                title={"Active Listings"}
                description={`${propertyReports?.statistics?.status?.ACTIVE?.percentage || 0} % of total listings`}
                value={
                    propertyReports?.statistics?.status?.ACTIVE
                        ?.count || 0
                }
            />
        </div>
    );
}

export default PropertyStatsSection; 