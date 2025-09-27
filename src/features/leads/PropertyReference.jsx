import { useQuery } from "@tanstack/react-query";
import styles from "./PropertyReference.module.css";
import { getPropertyReferenceHistory } from "../../services/apiAi";
import Spinner from "../../ui/Spinner";
import { Building, Home, DollarSign, Calendar, User, BarChart } from "lucide-react";

function PropertyReference({ propertyId }) {
    const {
        data: references,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["propertyReferences", propertyId],
        queryFn: () => getPropertyReferenceHistory(propertyId),
        enabled: !!propertyId,
    });

    if (isLoading) return <Spinner />;

    return (
        <>
            <div >
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <Building size={20} color="#010051" />
                        <h3 style={{ color: "#0c0a68", fontWeight: "bold" }}>
                            Property References History
                        </h3>
                    </div>
                </div>
                {error && (
                    <p className={styles.error}>
                        {error.message || "Error loading property references"}
                    </p>
                )}
                {!error &&
                    (!references || references.total_references === 0) && (
                        <p>No property references history found</p>
                    )}
                {!error &&
                    references &&
                    references.history &&
                    references.history.length > 0 && (
                        <>
                            
                            <ul className={styles.referenceList}>
                                {references.history?.map((reference, index) => (
                                    <li
                                        key={index}
                                        className={styles.referenceItem}
                                    >
                                        <div className={styles.referenceHeader}>
                                            <div className={styles.headerInfo}>
                                                <Calendar size={16} />
                                                <span className={styles.referenceDate}>
                                                    {new Date(reference.timestamp).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles.referenceContent}>
                                            <div className={styles.infoRow}>
                                                <div className={styles.infoItem}>
                                                    <Home size={16} />
                                                    <span>Property Type: {reference.lead_preferences.property_type.join(", ")}</span>
                                                </div>
                                                <div className={styles.infoItem}>
                                                    <User size={16} />
                                                    <span>Client Type: {reference.lead_preferences.clientType}</span>
                                                </div>
                                                <div className={styles.infoItem}>
                                                    <DollarSign size={16} />
                                                    <span>Budget: {reference.lead_preferences.budgetFrom || 'N/A'} - {reference.lead_preferences.budgetTo || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <div className={styles.analysisSection}>
                                                <div className={styles.infoItem}>
                                                    <BarChart size={16} />
                                                    <span>Analysis Summary</span>
                                                </div>
                                                <div className={styles.analysisSummary}>
                                                    {reference.analysis_summary.split('\n\n').map((section, idx) => (
                                                        <p key={idx}>{section}</p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
            </div>
        </>
    );
}

export default PropertyReference;
