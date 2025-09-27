import { useEffect } from "react";
import Spinner from "../../ui/Spinner";
import toast from "react-hot-toast";
import styles from "./GetLeads.module.css";
import useLeads from "../../features/leads/useLeads";
import { User, Phone, Mail, Calendar, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PropertyLeads({ propertyId, title ,type }) {
  const { data, isLoading, error } = useLeads(type, propertyId);
  const navigate = useNavigate();
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
            <div key={lead.id} className={styles.logItem}  onClick={() => navigate(`/leads/details/${lead.id}`)}>
              <div className={styles.leadHeader}>
                <div className={styles.userInfo}>
                  <User className={styles.icon} />
                  <span className={styles.name}>{lead.name}</span>
                  {lead.nationality && (
                    <span className={styles.nationality}>({lead.nationality})</span>
                  )}
                </div>
                <span className={styles.date}>
                  <Calendar className={styles.icon} />
                  {new Date(lead.createTime).toLocaleDateString()}
                </span>
              </div>

              <div className={styles.contactInfo}>
                <div className={styles.infoItem}>
                  <Phone className={styles.icon} />
                  <span>{lead.phone}</span>
                </div>
                {lead.email && (
                  <div className={styles.infoItem}>
                    <Mail className={styles.icon} />
                    <span>{lead.email}</span>
                  </div>
                )}
              </div>

              {lead.areas?.length > 0 && (
                <div className={styles.areaInfo}>
                  <MapPin className={styles.icon} />
                  <span>Interested in: {lead.areas.map(area => area.name).join(", ")}</span>
                </div>
              )}

              <div className={styles.tags}>
                <span className={`${styles.tag} ${styles[lead.status.toLowerCase()]}`}>
                  {lead.status}
                </span>
                <span className={`${styles.tag} ${styles[lead.clientType.toLowerCase()]}`}>
                  {lead.clientType}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>No Lead available for this Property.</p>
        )}
      </div>
    </div>
  );
}

export default PropertyLeads;