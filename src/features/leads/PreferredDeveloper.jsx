import styles from "./PreferredProperty.module.css";
import { Building } from "lucide-react";
import ConstructionIcon from '@mui/icons-material/Construction';

function PreferredDeveloper({ preferred_developer_details }) {
  if (!preferred_developer_details?.length) {
    return (
      <div className={"sectionDiv"}>
        <div className={styles.header}>
          <ConstructionIcon color="#010051"/>
          <h3 style={{color: "#0c0a68" , fontWeight: "bold"}}>Preferred Developers</h3>
        </div>
        <div >
          No preferred developers selected
        </div>
      </div>
    );
  }

  return (
    <div className={"sectionDiv"}>
      <div className={styles.header}>
        <ConstructionIcon color="#010051"/>
        <h3 style={{color: "#0c0a68" , fontWeight: "bold"}}>Preferred Developers</h3>
      </div>
      <div className={styles.container}>
        {preferred_developer_details?.map((developer) => (
          <div
            key={developer.id}
            className={styles.propertyCard}
          >
            <div className={styles.propertyContent}>
              <div className={styles.propertyHeader}>
                <h3 className={styles.propertyTitle}>{developer.name || "Developer"}</h3>
              </div>
              
              <div className={styles.developerLogo}>
                {developer.logoUrl ? (
                  <img 
                    src={developer.logoUrl} 
                    alt={developer.name} 
                    className={styles.logoImage}
                  />
                ) : (
                  <Building className={styles.icon} size={32} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PreferredDeveloper; 