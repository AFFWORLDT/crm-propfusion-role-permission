import { GoogleMap, useLoadScript, MarkerF, InfoWindow } from "@react-google-maps/api";
import { useState } from "react";
import useInfiniteAreas from "./useInfiniteAreas";
import styles from "./AreaMapView.module.css";
import { getGoogleMapsApiKey } from "../../config/googleMaps";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const options = {
  disableDefaultUI: false,
  zoomControl: true,
};

export default function AreaMapView() {
  const { areas, isLoading, error } = useInfiniteAreas(true);
  const [selectedArea, setSelectedArea] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: getGoogleMapsApiKey(),
    libraries: ['places', 'geometry'],
    language: 'en',
    region: 'AE'
  });

  // Default to Dubai if no data
  const mapCenter = areas.length > 0
    ? { lat: areas[0].latitude || 25.276987, lng: areas[0].longitude || 55.296249 }
    : { lat: 25.276987, lng: 55.296249 };

  if (loadError) {
    console.error('Google Maps Load Error:', loadError);
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#dc2626' }}>
        <h3>Map Loading Error</h3>
        <p>Unable to load Google Maps. Please check your internet connection.</p>
        <p>Error: {loadError.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{ 
            padding: '10px 20px', 
            background: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Retry
        </button>
      </div>
    );
  }
  
  if (!isLoaded || isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ 
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid #f3f4f6',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '10px'
        }}></div>
        <p>Loading Google Maps...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  if (error) return <div className={styles.errorMessage}>{error}</div>;

  return (
    <div className="sectionContainer">
      <section>
        <div className={styles.mapArea}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={11}
            center={mapCenter}
            options={options}
          >
            {areas.map((item) => (
              item.latitude && item.longitude && (
                <MarkerF
                  key={item.name}
                  position={{ lat: item.latitude, lng: item.longitude }}
                  onClick={() => setSelectedArea(item)}
                />
              )
            ))}

            {selectedArea && (
              <InfoWindow
                position={{ lat: selectedArea.latitude, lng: selectedArea.longitude }}
                onCloseClick={() => setSelectedArea(null)}
              >
                <div>
                  <h3 className={styles.popupTitle}>{selectedArea.name}</h3>
                  <p>{selectedArea.city}</p>
                  <div className={styles.countsList}>
                    <p>Properties for Sale: {selectedArea?.sell_properties_count ?? 0}</p>
                    <p>Properties for Rent: {selectedArea?.rent_properties_count ?? 0}</p>
                    <p>Projects: {selectedArea?.projects_count ?? 0}</p>
                    <p>Pool Projects: {selectedArea?.pool_projects_count ?? 0}</p>
                    <p>Total: {selectedArea?.total_count ?? 0}</p>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </section>
    </div>
  );
} 