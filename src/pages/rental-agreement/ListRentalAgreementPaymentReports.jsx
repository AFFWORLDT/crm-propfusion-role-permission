import useGetallRentalAgreementPaymentReports from "../../features/rental-agreement/useGetallRentalAgreementPaymentReports";
import SectionTop from "../../ui/SectionTop";
import Spinner from "../../ui/Spinner";
import SummaryCard from "../../features/rental-agreement/SummaryCard";
import PaymentFilter from "../../features/rental-agreement/PaymentFilter";
import PropertiesTabContent from "../../features/rental-agreement/PropertiesTabContent";
import PaymentAnalyticsTabContent from "../../features/rental-agreement/PaymentAnalyticsTabContent";
import { useState } from "react";
import styles from "./ListRentalAgreementPaymentReports.module.css";
import Pagination from "../../ui/Pagination";

function ListRentalAgreementPaymentReports() {
    const { isLoading, properties, summary, paymentAnalytics, pagination } = useGetallRentalAgreementPaymentReports();
    const [activeTab, setActiveTab] = useState("properties");

    if(isLoading) return <Spinner type="fullPage" />;

    return (
        <div className="sectionContainer">
            <SectionTop heading="Rental Agreement Payment Reports" />
            <section className="sectionStyles">
                <SummaryCard summary={summary} />
                {/* <PaymentFilter /> */}

                <div className={styles.contentContainer}>
                    <div className={styles.tabContainer}>
                        <ul className={styles.tabList}>
                            <li 
                                className={`${styles.tabItem} ${activeTab === "properties" ? styles.active : ""}`}
                                onClick={() => setActiveTab("properties")}
                            >
                                Properties
                            </li>
                            <li 
                                className={`${styles.tabItem} ${activeTab === "analytics" ? styles.active : ""}`}
                                onClick={() => setActiveTab("analytics")}
                            >
                                Payment Analytics
                            </li>
                        </ul>
                    </div>

                    <div className={styles.tabContent}>
                        {activeTab === "properties" && (
                            <PropertiesTabContent 
                                properties={properties}
                            
                            />
                        )}
                        {activeTab === "analytics" && (
                            <PaymentAnalyticsTabContent paymentAnalytics={paymentAnalytics} />
                        )}
                    </div>
                    <Pagination totalSize={pagination.total} isLoading={isLoading}  />
                </div>
            </section>
        </div>
    )
}

export default ListRentalAgreementPaymentReports