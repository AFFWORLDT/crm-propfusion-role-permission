import { useState } from "react";
import { Map, Globe } from "lucide-react";
import PlotMap from "./PlotMap";
import GoogleEarthMap from "./GoogleEarthMap";
import styles from "./MapSwitcher.module.css";

const MapSwitcher = ({ 
  listingType, 
  addresses, 
  initialHeight = 1000,
  onMarkerClick,
  center = { lat: 25.2048, lng: 55.2708 }
}) => {
  const [activeMap, setActiveMap] = useState("google-maps"); // "google-maps" or "google-earth"

  const handleMapSwitch = (mapType) => {
    setActiveMap(mapType);
  };

  return (
    <div className={styles.mapSwitcherContainer}>
      <div className={styles.mapSwitcherHeader}>
        <div className={styles.mapSwitcherTitle}>
          <h2>Interactive Map View</h2>
          <p>Choose between 2D Google Maps or 3D Google Earth view</p>
        </div>
        
        <div className={styles.mapSwitcherControls}>
          <button
            className={`${styles.mapSwitchButton} ${activeMap === "google-maps" ? styles.active : ""}`}
            onClick={() => handleMapSwitch("google-maps")}
          >
            <Map size={16} />
            <span>Google Maps</span>
          </button>
          
          <button
            className={`${styles.mapSwitchButton} ${activeMap === "google-earth" ? styles.active : ""}`}
            onClick={() => handleMapSwitch("google-earth")}
          >
            <Globe size={16} />
            <span>Google Earth</span>
          </button>
        </div>
      </div>

      <div className={styles.mapContainer}>
        {activeMap === "google-maps" ? (
          <PlotMap
            listingType={listingType}
            addresses={addresses}
            initialHeight={initialHeight}
            onMarkerClick={onMarkerClick}
            center={center}
          />
        ) : (
          <GoogleEarthMap
            listingType={listingType}
            addresses={addresses}
            initialHeight={initialHeight}
            onMarkerClick={onMarkerClick}
            center={center}
          />
        )}
      </div>
    </div>
  );
};

export default MapSwitcher; 