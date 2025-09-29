import { useState } from "react";
import SectionTop from "../ui/SectionTop";
import MapSwitcher from "../ui/MapSwitcher";
import styles from "./GoogleEarthDemo.module.css";

const GoogleEarthDemo = () => {
  const [selectedView, setSelectedView] = useState("switcher"); // "switcher" or "earth-only"

  // Sample property data for demonstration
  const sampleProperties = [
    {
      id: 1,
      name: "Luxury Villa - Palm Jumeirah",
      position: "25.1124,55.1390",
      price: "$2,500,000",
      status: "active",
      agentIcon: "https://images.freeimages.com/fic/images/icons/2463/glossy/512/location.png",
      location: {
        address: "Palm Jumeirah, Dubai",
        city: "Dubai",
        community: "Palm Jumeirah"
      }
    },
    {
      id: 2,
      name: "Modern Apartment - Downtown",
      position: "25.1972,55.2744",
      price: "$850,000",
      status: "active",
      agentIcon: "https://maps.google.com/mapfiles/kml/paddle/red-circle.png",
      location: {
        address: "Downtown Dubai",
        city: "Dubai",
        community: "Downtown"
      }
    },
    {
      id: 3,
      name: "Beachfront Villa - JBR",
      position: "25.0785,55.1378",
      price: "$1,800,000",
      status: "active",
      agentIcon: "https://images.freeimages.com/fic/images/icons/2463/glossy/512/location.png",
      location: {
        address: "Jumeirah Beach Residence",
        city: "Dubai",
        community: "JBR"
      }
    },
    {
      id: 4,
      name: "Penthouse - Marina",
      position: "25.0920,55.1420",
      price: "$3,200,000",
      status: "active",
      agentIcon: "https://maps.google.com/mapfiles/kml/paddle/red-circle.png",
      location: {
        address: "Dubai Marina",
        city: "Dubai",
        community: "Marina"
      }
    },
    {
      id: 5,
      name: "Townhouse - Arabian Ranches",
      position: "25.0589,55.1838",
      price: "$1,100,000",
      status: "active",
      agentIcon: "https://images.freeimages.com/fic/images/icons/2463/glossy/512/location.png",
      location: {
        address: "Arabian Ranches",
        city: "Dubai",
        community: "Arabian Ranches"
      }
    }
  ];

  const handleMarkerClick = (property) => {
    console.log('Property clicked:', property);
    // You can add navigation logic here
    alert(`Clicked on: ${property.name}\nPrice: ${property.price}\nLocation: ${property.location.address}`);
  };

  return (
    <div className="sectionContainer">
      <SectionTop heading="Google Earth Integration Demo">
        <div className={styles.demoControls}>
          <button
            className={`${styles.viewButton} ${selectedView === "switcher" ? styles.active : ""}`}
            onClick={() => setSelectedView("switcher")}
          >
            Map Switcher View
          </button>
          <button
            className={`${styles.viewButton} ${selectedView === "earth-only" ? styles.active : ""}`}
            onClick={() => setSelectedView("earth-only")}
          >
            Google Earth Only
          </button>
        </div>
      </SectionTop>

      <section className="sectionStyles">
        <div className={styles.demoInfo}>
          <h3>Google Earth API Integration</h3>
          <p>
            This demo showcases the Google Earth API integration in the ONEX Properties CRM system. 
            You can switch between traditional Google Maps and immersive 3D Google Earth views.
          </p>
          
          <div className={styles.features}>
            <h4>Features:</h4>
            <ul>
              <li>🗺️ Switch between Google Maps and Google Earth</li>
              <li>🌍 3D terrain and building visualization</li>
              <li>📍 Interactive property markers</li>
              <li>🎛️ Layer controls (buildings, terrain, labels)</li>
              <li>🔍 Navigation controls (zoom, reset, view modes)</li>
              <li>📱 Responsive design for all devices</li>
            </ul>
          </div>

          <div className={styles.sampleData}>
            <h4>Sample Properties:</h4>
            <p>Click on any marker to see property details. The demo includes 5 sample properties across Dubai.</p>
          </div>
        </div>

        <div className={styles.mapContainer}>
          {selectedView === "switcher" ? (
            <MapSwitcher
              listingType="SELL"
              addresses={sampleProperties}
              initialHeight={600}
              onMarkerClick={handleMarkerClick}
              center={{ lat: 25.2048, lng: 55.2708 }}
            />
          ) : (
            <div className={styles.earthOnlyContainer}>
              <h3>Google Earth View</h3>
              <p>This is a standalone Google Earth view without the map switcher.</p>
              {/* You can import and use GoogleEarthMap directly here */}
              <MapSwitcher
                listingType="SELL"
                addresses={sampleProperties}
                initialHeight={600}
                onMarkerClick={handleMarkerClick}
                center={{ lat: 25.2048, lng: 55.2708 }}
              />
            </div>
          )}
        </div>

        <div className={styles.instructions}>
          <h4>How to Use:</h4>
          <ol>
            <li>Use the map switcher to toggle between Google Maps and Google Earth</li>
            <li>In Google Earth mode, use the controls on the left to adjust layers and navigation</li>
            <li>Click on property markers to see details</li>
            <li>Use the expand button to view in full-screen mode</li>
            <li>Try different view modes (3D, 2D, Satellite) in Google Earth</li>
          </ol>
        </div>
      </section>
    </div>
  );
};

export default GoogleEarthDemo; 