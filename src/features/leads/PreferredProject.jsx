import styles from "./PreferredProperty.module.css";
import { MapPin, Building } from "lucide-react";
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import { useNavigate } from "react-router-dom";

function PreferredProject({ preferred_project_details }) {
  const navigate = useNavigate();

  const handleProjectClick = (projectId) => {
    navigate(`/new-projects/list/${projectId}`);
  };

  if (!preferred_project_details?.length) {
    return (
      <div className={"sectionDiv"}>
        <div className={styles.header}>
          <DomainAddIcon color="#010051"/>
          <h3 style={{color: "#0c0a68" , fontWeight: "bold"}}>Preferred Projects</h3>
        </div>
        <div >
         <span> No preferred projects selected</span>
        </div>
      </div>
    );
  }

  return (
    <div className={"sectionDiv"}>
      <div className={styles.header}>
        <DomainAddIcon color="#010051"/>
        <h3 style={{color: "#0c0a68" , fontWeight: "bold"}}>Preferred Projects</h3>
      </div>
      <div className={styles.container}>
        {preferred_project_details?.map((project) => (
          <div
            key={project.id}
            className={styles.propertyCard}
            onClick={() => handleProjectClick(project.id)}
          >
            <div className={styles.propertyContent}>
              <div className={styles.propertyHeader}>
                <h3 className={styles.propertyTitle}>{project.name || "Project"}</h3>
              </div>
              
              {project.location && (project.location.city || project.location.community) && (
                <div className={styles.propertyInfo}>
                  <MapPin className={styles.icon} size={16} />
                  <span>
                    {[project.location.city, project.location.community]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )}
              
              <div className={styles.projectDetails}>
                <div className={styles.detailItem}>
                  <Building className={styles.icon} size={16} />
                  <span>Project ID: {project.id}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PreferredProject; 