import styles from "./PreferredProperty.module.css";
import { useNavigate } from "react-router-dom";
import { MapPin, Building, BedDouble, Bath } from "lucide-react";

function PreferredProperty({ preferred_property_details ,type}) {
  const navigate = useNavigate();

  if (!preferred_property_details?.length) {
    return (
      <div className={"sectionDiv"}>
        <div className={styles.header}>
          <img color="#010051" src="/icons/description.svg" alt="" className={styles.headerIcon} />
          <h3 style={{color: "#0c0a68" , fontWeight: "bold"}}>Preferred Property</h3>
        </div>
        <div >
          <span> No preferred properties selected</span>
        </div>
      </div>
    );
  }

  return (
    <div className={"sectionDiv"}>
      <div className={styles.header}>
        <img  color="#010051" src="/icons/description.svg" alt="" className={styles.headerIcon} />
        <h3 style={{color: "#0c0a68" , fontWeight: "bold"}}>Preferred Property</h3>
      </div>
      <div className={styles.container}>
        {preferred_property_details?.map((property) => (
          <div
            key={property.id}
            className={styles.propertyCard}
            onClick={() => navigate(`/for-${type}/new-list/${property.id}`)}
          >
            <div className={styles.propertyContent}>
              <div className={styles.propertyHeader}>
                <h3 className={styles.propertyTitle}>{property.title || "Property"}</h3>
              </div>
              
              {property.location && (property.location.city || property.location.community || property.location.sub_community) && (
                <div className={styles.propertyInfo}>
                  <MapPin className={styles.icon} size={16} />
                  <span>
                    {[property.location.city, property.location.community, property.location.sub_community]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )}
              
              <div className={styles.propertyDetails}>
                {property.bedrooms && (
                  <div className={styles.detailItem}>
                    <BedDouble className={styles.icon} size={16} />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                )}
                
                {property.bathrooms && (
                  <div className={styles.detailItem}>
                    <Bath className={styles.icon} size={16} />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                )}

                {property.size && (
                  <div className={styles.detailItem}>
                    <Building className={styles.icon} size={16} />
                    <span>{property.size} sq ft</span>
                  </div>
                )}
              </div>

              {property.price && (
                <div className={styles.price}>
                  AED {property.price.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PreferredProperty;