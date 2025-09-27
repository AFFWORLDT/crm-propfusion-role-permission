import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Maximize2, 
  Minimize2, 
  Globe, 
  Layers, 
  Navigation,
  RotateCcw,
  Home,
  ZoomIn,
  ZoomOut,
  Compass
} from "lucide-react";
import { getGoogleEarthAPI } from "../utils/googleEarthLoader";
import { useGoogleEarth } from "../hooks/useGoogleEarth";
import styles from "./GoogleEarthMap.module.css";

const GoogleEarthMap = ({ 
  listingType, 
  addresses, 
  initialHeight = 1000,
  onMarkerClick,
  center = { lat: 25.2048, lng: 55.2708 }
}) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapHeight, setMapHeight] = useState(initialHeight);
  const [isExpanded, setIsExpanded] = useState(false);
  const [earthInstance, setEarthInstance] = useState(null);
  const [viewMode, setViewMode] = useState("3D"); // 3D, 2D, Satellite
  const [showBuildings, setShowBuildings] = useState(true);
  const [showTerrain, setShowTerrain] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  const earthContainerRef = useRef(null);
  const navigate = useNavigate();
  const { isLoading, isLoaded, error, reload } = useGoogleEarth();

  useEffect(() => {
    if (isExpanded) {
      const windowHeight = window.innerHeight;
      setMapHeight(windowHeight - 100);
    } else {
      setMapHeight(initialHeight);
    }
  }, [isExpanded, initialHeight]);

  const addPropertyMarkers = useCallback((earth) => {
    if (!addresses || addresses.length === 0) return;

    addresses.forEach((address, index) => {
      const position = parseLatLng(address?.position || address?.area?.position);
      if (!position) return;

      // Create placemark
      const placemark = earth.createPlacemark('');
      placemark.setId(`property-${index}`);

      // Create point
      const point = earth.createPoint('');
      point.setLatitude(position.lat);
      point.setLongitude(position.lng);
      point.setAltitude(0);
      placemark.setGeometry(point);

      // Create icon style
      const iconStyle = earth.createIconStyle('');
      iconStyle.setIcon(earth.createLink(''));
      iconStyle.getIcon().setHref(
        address.agentIcon || 
        (listingType === "new" && address?.status === "active"
          ? "https://images.freeimages.com/fic/images/icons/2463/glossy/512/location.png"
          : "https://maps.google.com/mapfiles/kml/paddle/red-circle.png")
      );
      iconStyle.setScale(1.0);
      placemark.setIconStyle(iconStyle);

      // Create label style
      const labelStyle = earth.createLabelStyle('');
      labelStyle.setColor(earth.createColor(''));
      labelStyle.getColor().set('ffffffff');
      labelStyle.setScale(1.0);
      placemark.setLabelStyle(labelStyle);

      // Set label
      placemark.setName(address.name || `Property ${index + 1}`);

      // Add click event
      if (window.google && window.google.earth) {
        window.google.earth.addEventListener(placemark, 'click', () => {
          handleMarkerClick(address);
        });
      }

      // Add to Earth
      earth.getFeatures().appendChild(placemark);
    });
  }, [addresses, listingType]);

  const parseLatLng = (positionString) => {
    if (!positionString?.includes(",")) return null;
    const [lat, lng] = positionString.split(",").map(Number);
    if (isNaN(lat) || isNaN(lng)) return null;
    return { lat, lng };
  };

  const handleMarkerClick = useCallback((address) => {
    setSelectedMarker(address);
    
    if (onMarkerClick) {
      onMarkerClick(address);
    } else if (listingType === "new") {
      address?.status === "active" 
        ? navigate(`/${listingType}-projects/list/${address.id}`)
        : navigate(`/${listingType}-projects/list/${address.id}?status=POOL`);
    } else if (listingType) {
      navigate(`/for-${listingType}/new-list/${address.id}`);
    }
  }, [onMarkerClick, listingType, navigate]);

  const initializeGoogleEarth = useCallback(async () => {
    try {
      const earthAPI = getGoogleEarthAPI();

      // Create Earth instance
      const earth = new earthAPI.Earth(earthContainerRef.current);
      
      // Initialize Earth
      await new Promise((resolve, reject) => {
        earth.init(() => {
          resolve();
        }, (error) => {
          reject(error);
        });
      });

      // Set initial view
      const lookAt = earth.createLookAt('');
      lookAt.setLatitude(center.lat);
      lookAt.setLongitude(center.lng);
      lookAt.setAltitude(10000);
      lookAt.setHeading(0);
      lookAt.setTilt(45);
      lookAt.setRange(5000);
      earth.getView().setAbstractView(lookAt);

      // Enable layers
      earth.getLayerRoot().enableLayerById(earth.LAYER_BORDERS, true);
      earth.getLayerRoot().enableLayerById(earth.LAYER_ROADS, true);
      earth.getLayerRoot().enableLayerById(earth.LAYER_BUILDINGS, showBuildings);
      earth.getLayerRoot().enableLayerById(earth.LAYER_TERRAIN, showTerrain);
      earth.getLayerRoot().enableLayerById(earth.LAYER_PLACES, showLabels);

      // Add markers for properties
      addPropertyMarkers(earth);

      setEarthInstance(earth);
    } catch (err) {
      console.error('Failed to initialize Google Earth:', err);
    }
  }, [center, showBuildings, showTerrain, showLabels, addPropertyMarkers]);

  useEffect(() => {
    if (isLoaded && !earthInstance) {
      initializeGoogleEarth();
    }
  }, [isLoaded, earthInstance, initializeGoogleEarth]);

  const toggleMapSize = () => {
    setIsExpanded(!isExpanded);
  };

  const resetView = () => {
    if (!earthInstance) return;
    
    const lookAt = earthInstance.createLookAt('');
    lookAt.setLatitude(center.lat);
    lookAt.setLongitude(center.lng);
    lookAt.setAltitude(10000);
    lookAt.setHeading(0);
    lookAt.setTilt(45);
    lookAt.setRange(5000);
    earthInstance.getView().setAbstractView(lookAt);
  };

  const zoomIn = () => {
    if (!earthInstance) return;
    const view = earthInstance.getView();
    const lookAt = view.getAbstractView();
    lookAt.setRange(lookAt.getRange() * 0.8);
    view.setAbstractView(lookAt);
  };

  const zoomOut = () => {
    if (!earthInstance) return;
    const view = earthInstance.getView();
    const lookAt = view.getAbstractView();
    lookAt.setRange(lookAt.getRange() * 1.2);
    view.setAbstractView(lookAt);
  };

  const toggleLayer = (layerId, enabled) => {
    if (!earthInstance) return;
    earthInstance.getLayerRoot().enableLayerById(layerId, enabled);
  };

  const changeViewMode = (mode) => {
    if (!earthInstance) return;
    
    setViewMode(mode);
    
    switch (mode) {
      case "2D": {
        // Switch to 2D view
        const lookAt2D = earthInstance.createLookAt('');
        lookAt2D.setLatitude(center.lat);
        lookAt2D.setLongitude(center.lng);
        lookAt2D.setAltitude(0);
        lookAt2D.setHeading(0);
        lookAt2D.setTilt(0);
        lookAt2D.setRange(5000);
        earthInstance.getView().setAbstractView(lookAt2D);
        break;
      }
      case "satellite":
        // Switch to satellite view
        earthInstance.getLayerRoot().enableLayerById(earthInstance.LAYER_SATELLITE, true);
        break;
      default: {
        // 3D view
        const lookAt3D = earthInstance.createLookAt('');
        lookAt3D.setLatitude(center.lat);
        lookAt3D.setLongitude(center.lng);
        lookAt3D.setAltitude(10000);
        lookAt3D.setHeading(0);
        lookAt3D.setTilt(45);
        lookAt3D.setRange(5000);
        earthInstance.getView().setAbstractView(lookAt3D);
        break;
      }
    }
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Globe size={48} className={styles.errorIcon} />
        <h3>Google Earth Error</h3>
        <p className={styles.errorMessage}>{error}</p>
        <button 
          className={styles.retryButton}
          onClick={reload}
        >
          <RotateCcw size={16} />
          Retry
        </button>
      </div>
    );
  }

  if (isLoading || !isLoaded) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <Globe size={32} className={styles.loadingIcon} />
        <p>Loading Google Earth...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.earthContainer} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.earthHeader}>
        <div className={styles.earthTitle}>
          <Globe size={20} />
          <h2>Google Earth View</h2>
        </div>
        <button 
          className={styles.expandButton}
          onClick={toggleMapSize}
          aria-label={isExpanded ? "Minimize map" : "Maximize map"}
        >
          {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>

      <div className={styles.earthControlsWrapper}>
        <div className={styles.earthControls}>
          <div className={styles.controlSection}>
            <div className={styles.sectionHeader}>
              <Navigation size={16} />
              <span>Navigation</span>
            </div>
            <div className={styles.navigationControls}>
              <button 
                className={styles.controlButton}
                onClick={resetView}
                title="Reset View"
              >
                <Home size={16} />
              </button>
              <button 
                className={styles.controlButton}
                onClick={zoomIn}
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
              <button 
                className={styles.controlButton}
                onClick={zoomOut}
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
            </div>
          </div>

          <div className={styles.controlSection}>
            <div className={styles.sectionHeader}>
              <Layers size={16} />
              <span>Layers</span>
            </div>
            <div className={styles.layerControls}>
              <label className={styles.layerToggle}>
                <span>Buildings</span>
                <input
                  type="checkbox"
                  checked={showBuildings}
                  onChange={(e) => {
                    setShowBuildings(e.target.checked);
                    toggleLayer(window.google.earth.LAYER_BUILDINGS, e.target.checked);
                  }}
                  className={styles.layerCheckbox}
                />
                <span className={styles.switch}></span>
              </label>
              <label className={styles.layerToggle}>
                <span>Terrain</span>
                <input
                  type="checkbox"
                  checked={showTerrain}
                  onChange={(e) => {
                    setShowTerrain(e.target.checked);
                    toggleLayer(window.google.earth.LAYER_TERRAIN, e.target.checked);
                  }}
                  className={styles.layerCheckbox}
                />
                <span className={styles.switch}></span>
              </label>
              <label className={styles.layerToggle}>
                <span>Labels</span>
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => {
                    setShowLabels(e.target.checked);
                    toggleLayer(window.google.earth.LAYER_PLACES, e.target.checked);
                  }}
                  className={styles.layerCheckbox}
                />
                <span className={styles.switch}></span>
              </label>
            </div>
          </div>

          <div className={styles.controlSection}>
            <div className={styles.sectionHeader}>
              <Compass size={16} />
              <span>View Mode</span>
            </div>
            <select
              value={viewMode}
              onChange={(e) => changeViewMode(e.target.value)}
              className={styles.viewModeSelect}
            >
              <option value="3D">3D Earth</option>
              <option value="2D">2D Map</option>
              <option value="satellite">Satellite</option>
            </select>
          </div>
        </div>
      </div>

      <div 
        ref={earthContainerRef}
        className={styles.earthMap}
        style={{ height: isExpanded ? "100vh" : `${mapHeight}px` }}
      />

      {selectedMarker && (
        <div className={styles.infoWindow}>
          <div className={styles.infoHeader}>
            <h3>{selectedMarker.name || "Property"}</h3>
            <button 
              className={styles.closeButton}
              onClick={() => setSelectedMarker(null)}
            >
              ×
            </button>
          </div>
          <div className={styles.infoContent}>
            <p><strong>Type:</strong> {listingType || "Property"}</p>
            <p><strong>Status:</strong> {selectedMarker.status || "Available"}</p>
            {selectedMarker.price && (
              <p><strong>Price:</strong> {selectedMarker.price}</p>
            )}
            {selectedMarker.location && (
              <p><strong>Location:</strong> {selectedMarker.location.address}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleEarthMap; 