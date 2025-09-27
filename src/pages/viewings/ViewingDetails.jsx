import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getViewing } from "../../services/apiAllViewing"; // Import the API function
import SectionTop from "../../ui/SectionTop";
import styles from "./ViewingDetails.module.css";
import { 
  Calendar, 
  Clock, 
  Home, 
  User, 
  Mail, 
  Phone, 
  UserCheck, 
  FileText, 
  Tag, 
  AlertCircle
} from "lucide-react";

function ViewingDetails() {
    const { viewingId } = useParams();
    const [viewingDetails, setViewingDetails] = useState(null); // State to store viewing details
    const [isLoading, setIsLoading] = useState(true); // State to track loading
    const [error, setError] = useState(null); // State to track errors

    useEffect(() => {
        const fetchViewingDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch actual viewing data using the API function
                console.log("Fetching details for viewing ID:", viewingId);
                const data = await getViewing(viewingId);

                setViewingDetails(data);
            } catch (err) {
                setError(err);
                console.error("Failed to fetch viewing details:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (viewingId) {
            fetchViewingDetails();
        }   
    }, [viewingId]);

    if (isLoading) {
        return <div className={styles.loadingState}>
            <Clock className={styles.loadingIcon} size={24} />
            Loading viewing details...
        </div>; // Loading state with icon
    }

    if (error) {
        return <div className={styles.errorState}>
            <AlertCircle className={styles.errorIcon} size={24} color="#e53935" />
            Error loading viewing details: {error.message}
        </div>; // Error state with icon
    }

    if (!viewingDetails) {
        return <div className={styles.emptyState}>
            <AlertCircle className={styles.emptyIcon} size={24} color="#ff9800" />
            Viewing not found or no data available.
        </div>; // No data state with icon
    }

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(date);
    };

    // Get status class for badge styling
    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'scheduled': return styles.scheduled;
            case 'completed': return styles.completed;
            case 'cancelled': return styles.cancelled;
            case 'pending': return styles.pending;
            default: return '';
        }
    };

    // Display viewing details once loaded
    return (
        <div className="sectionContainer">
            <SectionTop heading="Viewing Details" />
            <section className="sectionStyles">
                <div className={styles.viewingCard}>
                    {/* Basic Information Section */}
                    <div className={styles.infoSection}>
                        <h3 className={styles.infoHeader}>
                            <Home size={18} className={styles.headerIcon} />
                            Basic Information
                        </h3>
                        <div className={styles.infoContent}>
                            <div className={styles.infoRow}>
                                <div className={styles.infoLabelContainer}>
                                    <Tag size={16} className={styles.infoIcon} />
                                    <span className={styles.infoLabel}>Viewing ID:</span>
                                </div>
                                <div className={styles.infoValue}>{viewingDetails.id}</div>
                            </div>
                            
                            <div className={styles.infoRow}>
                                <div className={styles.infoLabelContainer}>
                                    <Home size={16} className={styles.infoIcon} />
                                    <span className={styles.infoLabel}>Property:</span>
                                </div>
                                <div className={styles.infoValue}>{viewingDetails.property?.title || "N/A"}</div>
                            </div>
                            
                            <div className={styles.infoRow}>
                                <div className={styles.infoLabelContainer}>
                                    <Calendar size={16} className={styles.infoIcon} />
                                    <span className={styles.infoLabel}>Date & Time:</span>
                                </div>
                                <div className={styles.infoValue}>{formatDate(viewingDetails.viewing_date)}</div>
                            </div>
                            
                            <div className={styles.infoRow}>
                                <div className={styles.infoLabelContainer}>
                                    <Clock size={16} className={styles.infoIcon} />
                                    <span className={styles.infoLabel}>Duration:</span>
                                </div>
                                <div className={styles.infoValue}>{viewingDetails.duration_minutes || "N/A"} minutes</div>
                            </div>
                            
                            <div className={styles.infoRow}>
                                <div className={styles.infoLabelContainer}>
                                    <AlertCircle size={16} className={styles.infoIcon} />
                                    <span className={styles.infoLabel}>Status:</span>
                                </div>
                                <div className={styles.infoValue}>
                                    <span className={`${styles.statusBadge} ${getStatusClass(viewingDetails.status)}`}>
                                        {viewingDetails.status || "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Client Information Section */}
                    <div className={styles.infoSection}>
                        <h3 className={styles.infoHeader}>
                            <User size={18} className={styles.headerIcon} />
                            Client Information
                        </h3>
                        <div className={styles.infoContent}>
                            <div className={styles.infoRow}>
                                <div className={styles.infoLabelContainer}>
                                    <User size={16} className={styles.infoIcon} />
                                    <span className={styles.infoLabel}>Name:</span>
                                </div>
                                <div className={styles.infoValue}>{viewingDetails.client_name || "N/A"}</div>
                            </div>
                            
                            <div className={styles.infoRow}>
                                <div className={styles.infoLabelContainer}>
                                    <Mail size={16} className={styles.infoIcon} />
                                    <span className={styles.infoLabel}>Email:</span>
                                </div>
                                <div className={styles.infoValue}>{viewingDetails.client_email || "N/A"}</div>
                            </div>
                            
                            <div className={styles.infoRow}>
                                <div className={styles.infoLabelContainer}>
                                    <Phone size={16} className={styles.infoIcon} />
                                    <span className={styles.infoLabel}>Phone:</span>
                                </div>
                                <div className={styles.infoValue}>{viewingDetails.client_phone || "N/A"}</div>
                            </div>
                        </div>
                    </div>

                    {/* Agent Information Section */}
                    <div className={styles.infoSection}>
                        <h3 className={styles.infoHeader}>
                            <UserCheck size={18} className={styles.headerIcon} />
                            Agent Information
                        </h3>
                        <div className={styles.infoContent}>
                            <div className={styles.infoRow}>
                                <div className={styles.infoLabelContainer}>
                                    <Tag size={16} className={styles.infoIcon} />
                                    <span className={styles.infoLabel}>Agent ID:</span>
                                </div>
                                <div className={styles.infoValue}>{viewingDetails.agent_id || "N/A"}</div>
                            </div>
                            
                            <div className={styles.infoRow}>
                                <div className={styles.infoLabelContainer}>
                                    <User size={16} className={styles.infoIcon} />
                                    <span className={styles.infoLabel}>Name:</span>
                                </div>
                                <div className={styles.infoValue}>{viewingDetails.agent?.name || "N/A"}</div>
                            </div>
                        </div>
                    </div>

                    {/* Notes Section */}
                    {viewingDetails.notes && (
                        <div className={styles.infoSection}>
                            <h3 className={styles.infoHeader}>
                                <FileText size={18} className={styles.headerIcon} />
                                Notes
                            </h3>
                            <div className={styles.notes}>{viewingDetails.notes}</div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default ViewingDetails;
