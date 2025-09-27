import { useState, useEffect, useRef } from "react";
import SectionTop from "../ui/SectionTop";
import styles from "./TwoGisDemo.module.css";
import axiosInstance from "../utils/axiosInstance"; // Import the configured axios instance

// Helper function to generate a random, visually appealing color
const generateRandomColor = () => {
  const goldenRatioConjugate = 0.618033988749895;
  let hue = Math.random();
  hue += goldenRatioConjugate;
  hue %= 1;
  const h = Math.floor(hue * 360);
  const s = Math.floor(Math.random() * (100 - 50) + 50); // Saturation between 50% and 100%
  const l = Math.floor(Math.random() * (80 - 40) + 40); // Lightness between 40% and 80%
  return `hsl(${h},${s}%,${l}%)`;
};


// Helper function to create a small rectangular polygon around a center point
const createPolygonFromCenter = (lat, lon, size = 0.01) => {
  const halfSize = size / 2;
  return [
    [lat - halfSize, lon - halfSize],
    [lat + halfSize, lon - halfSize],
    [lat + halfSize, lon + halfSize],
    [lat - halfSize, lon + halfSize],
  ];
};


const TwoGisDemo = () => {
  const mapRef = useRef(null);
  const [areas, setAreas] = useState({});
  const [areaLayers, setAreaLayers] = useState({});
  const [visibleAreas, setVisibleAreas] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndProcessCommunities = async () => {
      try {
        // Use the configured axiosInstance to make the API call
        const response = await axiosInstance.get('/locations/communities?sort_by=total_count&sort_order=desc&page=1&size=5000');
        
        // Axios wraps the response in a `data` property
        const responseData = response.data;

        // Transform the API data into the format our component expects
        const transformedAreas = responseData.communities.reduce((acc, community) => {
          if (!community.latitude || !community.longitude) {
            return acc; // Skip communities without location data
          }
          acc[community.name] = {
            color: generateRandomColor(),
            coordinates: createPolygonFromCenter(community.latitude, community.longitude),
            properties: {
              totalListings: community.total_count,
              sellProperties: community.sell_properties_count,
              rentProperties: community.rent_properties_count,
              city: community.city,
              photo: community.photos?.[0] || 'https://via.placeholder.com/150'
            }
          };
          return acc;
        }, {});

        setAreas(transformedAreas);

        // Initialize visibility state for all fetched areas
        const initialVisibility = {};
        Object.keys(transformedAreas).forEach(areaName => {
          initialVisibility[areaName] = true;
        });
        setVisibleAreas(initialVisibility);

      } catch (err) {
        // Axios provides more detailed error info
        const errorMessage = err.response?.data?.message || err.message || 'An unknown error occurred';
        setError(errorMessage);
        console.error("API call failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessCommunities();
  }, []);

  useEffect(() => {
    if (isLoading || error || Object.keys(areas).length === 0) return;

    const initMap = () => {
      window.DG.then(() => {
        if (mapRef.current) {
          mapRef.current.destroy();
        }

        const mapInstance = window.DG.map("map", {
          center: [25.276987, 55.296249], // Centered on Dubai city
          zoom: 11, // Zoomed in closer
          fullscreenControl: true,
          zoomControl: true,
        });
        mapRef.current = mapInstance;

        const layers = {};
        Object.entries(areas).forEach(([areaName, areaData]) => {
          const polygon = window.DG.polygon(areaData.coordinates, {
            color: areaData.color,
            fillColor: areaData.color,
            fillOpacity: 0.4,
          }).addTo(mapInstance);

          // Create dynamic popup content from API data
          polygon.bindPopup(`
            <div class="${styles.areaPopup}">
              <img src="${areaData.properties.photo}" alt="${areaName}" class="${styles.popupImage}" />
              <h3>${areaName}</h3>
              <p><strong>City:</strong> ${areaData.properties.city}</p>
              <p><strong>Total Properties:</strong> ${areaData.properties.totalListings}</p>
              <p><strong>For Sale:</strong> ${areaData.properties.sellProperties}</p>
              <p><strong>For Rent:</strong> ${areaData.properties.rentProperties}</p>
            </div>
          `);
          layers[areaName] = polygon;
        });
        setAreaLayers(layers);
      });
    };
    
    if (window.DG) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = "https://maps.api.2gis.ru/2.0/loader.js?pkg=full";
      script.async = true;
      document.body.appendChild(script);
      script.onload = initMap;
    }

    return () => {
      if (mapRef.current) {
        if (typeof mapRef.current.remove === 'function') {
          mapRef.current.remove();
        }
        mapRef.current = null;
      }
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        mapContainer.innerHTML = '';
      }
    };
  }, [areas, isLoading, error]);

  const toggleArea = (areaName) => {
    setVisibleAreas(prev => {
      const newState = { ...prev, [areaName]: !prev[areaName] };
      if (areaLayers[areaName] && mapRef.current) {
        if (newState[areaName]) {
          areaLayers[areaName].addTo(mapRef.current);
        } else {
          areaLayers[areaName].remove();
        }
      }
      return newState;
    });
  };

  if (isLoading) {
    return <div className={styles.centeredMessage}>Loading Community Data from API...</div>;
  }

  if (error) {
    return <div className={styles.centeredMessage}>Error fetching data: {error}</div>;
  }

  return (
    <div className={styles.mapOnlyContainer}>
      <div id="map" className={styles.map}></div>
    </div>
  );
};

export default TwoGisDemo; 