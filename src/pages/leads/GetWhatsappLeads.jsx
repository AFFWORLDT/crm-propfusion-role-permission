import { useEffect } from "react";
import Spinner from "../../ui/Spinner";
import toast from "react-hot-toast";
import styles from "./GetLeads.module.css";
import { User, Phone, Mail, Calendar } from "lucide-react";
import useWhatsappLeadsForPropertyDetails from "../../features/leads/whatsappLeads/useWhatsppLeadForPropertyDetails";

function WhatsappLeads({ propertyId, title }) {
    const { data, isLoading, error } = useWhatsappLeadsForPropertyDetails(propertyId);
    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    if (isLoading) return <Spinner type="fullPage" />;

    return (
        <div className={styles.sectionDiv}>
            <div className={styles.leadLogsTop}>
                <h3>
                    <img src="/icons/description.svg" alt="" />
                    <span>{title}</span>
                </h3>
            </div>

            <div className={styles.logsContainer}>
                {data?.length > 0 ? (
                    data?.map((lead) => (
                        <div key={lead?.lead_id} className={styles.logItem} >
                            <div className={styles.leadHeader}>
                                <div className={styles.userInfo}>
                                    <User className={styles.icon} />
                                    <span className={styles.name}>{lead?.property_title || "Unknown"}</span>
                                </div>
                                <span className={styles.date}>
                                    <Calendar className={styles.icon} />
                                    {new Date(lead?.date_time).toLocaleDateString()}
                                </span>
                            </div>

                            <div className={styles.contactInfo}>
                                <div className={styles.infoItem}>
                                    <Phone className={styles.icon} />
                                    <span>{lead?.cell}</span>
                                </div>
                                {lead?.portal && (
                                    <div className={styles.infoItem}>
                                        <Mail className={styles.icon} />
                                        <span>{lead?.portal}</span>
                                    </div>
                                )}
                            </div>

                            <div className={styles.tags}>
                                <span className={`${styles.tag} ${styles[lead?.status?.toLowerCase() || "unknown"]}`}>
                                    {lead?.status || "Unknown"}
                                </span>
                                <span className={`${styles.tag} ${styles[lead?.listingType?.toLowerCase() || "unknown"]}`}>
                                    {lead?.listingType || "Unknown"}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={styles.noLogs}>No Lead available for this Property.</p>
                )}
            </div>
        </div>
    );
}

export default WhatsappLeads;