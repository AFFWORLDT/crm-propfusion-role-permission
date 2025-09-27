import { useState, useEffect, useCallback, useMemo, memo } from "react";
import {
    GoogleMap,
    useLoadScript,
    InfoWindow,
    BicyclingLayer,
    TrafficLayer,
    TransitLayer,
    Polygon,
    OverlayView,
    MarkerF,
    MarkerClusterer,
} from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import {
    Maximize2,
    Minimize2,
    Map as MapIcon,
    Layers,
    Navigation,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import styles from "./PlotMap.module.css";
import { GOOGLE_MAPS_API_KEY } from "../config/googleMaps";

// Memoize the CustomMarker component
const CustomMarker = memo(({ position, imageUrl, onClick, name }) => {
    return (
        <OverlayView
            position={position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
            <div
                onClick={onClick}
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid #1976d2",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                    background: "#fff",
                    cursor: "pointer",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <img
                    src={imageUrl}
                    alt={name}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            </div>
        </OverlayView>
    );
});

CustomMarker.displayName = 'CustomMarker';

const PlotMap = ({ listingType, addresses, initialHeight = 1000, polygons = [] }) => {
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [mapInstance, setMapInstance] = useState(null);
    const [mapTypeId, setMapTypeId] = useState("roadmap");
    const [showTraffic, setShowTraffic] = useState(false);
    const [showTransit, setShowTransit] = useState(false);
    const [showBicycling, setShowBicycling] = useState(false);
    const [mapHeight, setMapHeight] = useState(initialHeight);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showControls, setShowControls] = useState(true);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    const navigate = useNavigate();

    useEffect(() => {
        setMapHeight(isExpanded ? window.innerHeight - 100 : initialHeight);
    }, [isExpanded, initialHeight]);

    // Memoize map container style
    const mapContainerStyle = useMemo(() => ({
        width: "100%",
        height: isExpanded ? "100vh" : `${mapHeight}px`,
        transition: "all 0.3s ease-in-out",
    }), [isExpanded, mapHeight]);

    // Memoize map options
    const mapOptions = useMemo(() => ({
        mapTypeId: mapTypeId,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: window.google?.maps?.MapTypeControlStyle?.HORIZONTAL_BAR,
            position: window.google?.maps?.ControlPosition?.TOP_RIGHT,
        },
        fullscreenControl: false,
        streetViewControl: true,
        zoomControl: true,
        zoomControlOptions: {
            position: window.google?.maps?.ControlPosition?.RIGHT_CENTER,
        },
        scaleControl: true,
        rotateControl: true,
        scrollwheel: true,
        clickableIcons: true,
        disableDoubleClickZoom: false,
        draggable: true,
        keyboardShortcuts: true,
        gestureHandling: "cooperative",
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "on" }],
            },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#a3ccff" }],
            },
        ],
    }), [mapTypeId]);

    const parseLatLng = useCallback((positionString) => {
        if (!positionString?.includes(",")) return null;
        const [lat, lng] = positionString.split(",").map(Number);
        return isNaN(lat) || isNaN(lng) ? null : { lat, lng };
    }, []);

    // Calculate center based on markers
    const center = useMemo(() => {
        const validPositions = addresses
            .map(addr => parseLatLng(addr?.position || addr?.area?.position))
            .filter(pos => pos !== null);

        if (validPositions.length === 0) {
            return { lat: 25.2048, lng: 55.2708 }; // Default center
        }

        const sumLat = validPositions.reduce((sum, pos) => sum + pos.lat, 0);
        const sumLng = validPositions.reduce((sum, pos) => sum + pos.lng, 0);
        return {
            lat: sumLat / validPositions.length,
            lng: sumLng / validPositions.length,
        };
    }, [addresses, parseLatLng]);

    // Memoize marker click handler
    const handleMarkerClick = useCallback((address) => {
        setSelectedMarker(address);
        if (mapInstance && address?.position) {
            const position = parseLatLng(address.position);
            if (position) {
                mapInstance.panTo(position);
            }
        }
    }, [mapInstance, parseLatLng]);

    // Memoize navigation handler
    const handleNavigate = useCallback((address) => {
        const path = window.location.pathname;
        const searchParams = new URLSearchParams(window.location.search);
        const status = searchParams.get('status');
        const isNewProjects = path.includes('new-projects');
        const statusParam = status === 'POOL' ? '?status=POOL' : '';
        navigate(isNewProjects ? `/new-projects/list/${address.id}${statusParam}` : `/for-${listingType}/new-list/${address.id}`);
    }, [navigate, listingType]);

    if (loadError) {
        return (
            <div className={styles.errorContainer}>
                <p className={styles.errorMessage}>
                    Error loading maps: {loadError.message}
                </p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading Maps...</p>
            </div>
        );
    }
    return (
        <div className={`${styles.mapContainer} ${isExpanded ? styles.expanded : ""}`}>
            <div className={styles.mapHeader}>
                <div className={styles.mapTitle}>
                    <MapIcon size={20} />
                    <h2>Interactive Map</h2>
                </div>
                <button
                    className={styles.expandButton}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
            </div>

            <div className={`${styles.mapControlsWrapper} ${!showControls ? styles.hidden : ""}`}>
                <div className={styles.mapControls}>
                    <div className={styles.controlSection}>
                        <div className={styles.sectionHeader}>
                            <Layers size={16} />
                            <span>Map Type</span>
                        </div>
                        <select
                            value={mapTypeId}
                            onChange={(e) => setMapTypeId(e.target.value)}
                            className={styles.mapTypeSelect}
                        >
                            <option value="roadmap">Road Map</option>
                            <option value="satellite">Satellite</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="terrain">Terrain</option>
                        </select>
                    </div>

                    <div className={styles.controlSection}>
                        <div className={styles.sectionHeader}>
                            <Navigation size={16} />
                            <span>Layers</span>
                        </div>
                        <div className={styles.layerControls}>
                            {[
                                { label: "Traffic", state: showTraffic, setter: setShowTraffic },
                                { label: "Transit", state: showTransit, setter: setShowTransit },
                                { label: "Bicycling", state: showBicycling, setter: setShowBicycling },
                            ].map((item, i) => (
                                <label key={i} className={styles.layerToggle}>
                                    <span>{item.label}</span>
                                    <input
                                        type="checkbox"
                                        checked={item.state}
                                        onChange={() => item.setter(!item.state)}
                                        className={styles.layerCheckbox}
                                    />
                                    <span className={styles.switch}></span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <button
                className={`${styles.toggleButton} ${!showControls ? styles.toggleButtonHidden : ""}`}
                onClick={() => setShowControls(!showControls)}
            >
                {showControls ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>

            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={8}
                options={mapOptions}
                onLoad={setMapInstance}
                onClick={() => setSelectedMarker(null)}
            >
                {showTraffic && <TrafficLayer />}
                {showTransit && <TransitLayer />}
                {showBicycling && <BicyclingLayer />}

                {polygons.map((poly, idx) => (
                    <Polygon
                        key={`poly-${idx}`}
                        paths={poly.paths}
                        options={{
                            fillColor: poly.fillColor,
                            fillOpacity: 0.4,
                            strokeColor: poly.fillColor,
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                        }}
                    />
                ))}

                <MarkerClusterer>
                    {(clusterer) => (
                        <>
                            {addresses.map((address, index) => {
                                const position = parseLatLng(address?.position || address?.area?.position);
                                if (!position) return null;

                                return (
                                    <div key={index}>
                                        {address.agentIcon ? (
                                            <CustomMarker
                                                position={position}
                                                imageUrl={address.agentIcon}
                                                name={address?.name || address?.area?.name}
                                                onClick={() => handleMarkerClick(address)}
                                            />
                                        ) : (
                                            <MarkerF
                                                position={position}
                                                clusterer={clusterer}
                                                icon={{
                                                    url: listingType === "new" && address?.status === "active"
                                                        ? "https://images.freeimages.com/fic/images/icons/2463/glossy/512/location.png"
                                                        : "https://maps.google.com/mapfiles/kml/paddle/red-circle.png",
                                                    scaledSize: new window.google.maps.Size(40, 40),
                                                }}
                                                onClick={() => handleMarkerClick(address)}
                                            />
                                        )}

                                        {selectedMarker?.id === address.id && (
                                            <InfoWindow
                                                position={position}
                                                onCloseClick={() => setSelectedMarker(null)}
                                            >
                                                <div
                                                    className={styles.infoWindow}
                                                    style={{
                                                        textAlign: "center",
                                                        minWidth: 220,
                                                        maxWidth: 260,
                                                    }}
                                                >
                                                    {address.photo && (
                                                        <img
                                                            src={address.photo}
                                                            alt="Property"
                                                            style={{
                                                                width: "100%",
                                                                height: 120,
                                                                objectFit: "cover",
                                                                borderRadius: 10,
                                                                marginBottom: 8,
                                                            }}
                                                        />
                                                    )}
                                                    {address.agentIcon && (
                                                        <img
                                                            src={address.agentIcon}
                                                            alt={address?.name || address?.area?.name}
                                                            style={{
                                                                width: 48,
                                                                height: 48,
                                                                borderRadius: "50%",
                                                                objectFit: "cover",
                                                                marginBottom: 8,
                                                                border: "2px solid #1976d2",
                                                            }}
                                                        />
                                                    )}
                                                    <h3
                                                        onClick={() => {
                                                            const path = window.location.pathname;
                                                            const searchParams = new URLSearchParams(window.location.search);
                                                            const status = searchParams.get('status');
                                                            const isNewProjects = path.includes('new-projects');
                                                            const statusParam = status === 'POOL' ? '?status=POOL' : '';
                                                            navigate(isNewProjects ? `/new-projects/list/${address.id}${statusParam}` : `/for-${listingType}/new-list/${address.id}`);
                                                        }}
                                                        style={{
                                                            margin: "8px 0 4px 0",
                                                            fontSize: "1.1rem",
                                                            color: "#1976d2",
                                                            cursor: "pointer",
                                                            textDecoration: "underline",
                                                        }}
                                                    >
                                                        {address.name || address?.area?.name}
                                                    </h3>
                                                    {address.description && (
                                                        <p style={{ margin: 0, color: "#444" }}>
                                                            {address.description}
                                                        </p>
                                                    )}
                                                    {address.price && (
                                                        <p
                                                            style={{
                                                                margin: "6px 0 0 0",
                                                                color: "#1976d2",
                                                                fontWeight: 700,
                                                                fontSize: "1.1rem",
                                                            }}
                                                        >
                                                            Price: AED {address.price.toLocaleString()}
                                                        </p>
                                                    )}
                                                    <button
                                                        style={{
                                                            marginTop: 8,
                                                            padding: "6px 16px",
                                                            background: "#1976d2",
                                                            color: "#fff",
                                                            border: "none",
                                                            borderRadius: 6,
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => handleNavigate(address)}
                                                    >
                                                        Go to Details
                                                    </button>
                                                </div>
                                            </InfoWindow>
                                        )}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </MarkerClusterer>
            </GoogleMap>
        </div>
    );
};

export default memo(PlotMap);
