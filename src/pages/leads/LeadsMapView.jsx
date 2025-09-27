import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MapPin, User, Phone, Mail, Calendar, MessageSquare, X, ExternalLink, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
    GoogleMap, 
    useLoadScript, 
    MarkerF, 
    InfoWindow,
    OverlayView 
} from '@react-google-maps/api';
import { getGoogleMapsApiKey } from '../../config/googleMaps';
import './LeadsMapView.css';

const LeadsMapView = ({ 
    data, 
    isLoading, 
    error, 
    totalSize, 
    containerRef, 
    hasNextPage, 
    fetchNextPage, 
    isFetchingNextPage 
}) => {
    const [selectedLead, setSelectedLead] = useState(null);
    const [mapInstance, setMapInstance] = useState(null);
    const mapRef = useRef(null);
    const navigate = useNavigate();

    // Google Maps configuration
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: getGoogleMapsApiKey(),
        libraries: ['places', 'geometry'],
        language: 'en',
        region: 'AE'
    });
    // Filter leads that have location data
    const leadsWithLocation = data?.filter(lead => 
        lead.location && 
        lead.location.latitude && 
        lead.location.longitude
    ) || [];

    // Calculate map center based on leads
    const mapCenter = useMemo(() => {
        if (leadsWithLocation.length === 0) {
            return { lat: 25.2048, lng: 55.2708 }; // Dubai center
        }

        const lats = leadsWithLocation.map(lead => lead.location.latitude);
        const lngs = leadsWithLocation.map(lead => lead.location.longitude);
        
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);
        
        const centerLat = (minLat + maxLat) / 2;
        const centerLng = (minLng + maxLng) / 2;
        
        return { lat: centerLat, lng: centerLng };
    }, [leadsWithLocation]);

    // Map options
    const mapOptions = useMemo(() => ({
        mapTypeId: 'roadmap',
        mapTypeControl: true,
        fullscreenControl: false,
        streetViewControl: true,
        zoomControl: true,
        scaleControl: true,
        scrollwheel: true,
        clickableIcons: true,
        disableDoubleClickZoom: false,
        draggable: true,
        keyboardShortcuts: true,
        gestureHandling: 'cooperative',
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'on' }],
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#a3ccff' }],
            },
        ],
    }), []);

    // Map container style
    const mapContainerStyle = useMemo(() => ({
        width: '100%',
        height: '100%',
    }), []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-AE', {
            style: 'currency',
            currency: 'AED',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE':
                return '#10b981';
            case 'DEAL':
                return '#3b82f6';
            case 'INACTIVE':
                return '#ef4444';
            case 'DRAFT':
                return '#f59e0b';
            default:
                return '#6b7280';
        }
    };

    const getClientTypeColor = (clientType) => {
        switch (clientType) {
            case 'SELL':
                return '#8b5cf6';
            case 'RENT':
                return '#06b6d4';
            case 'UNDEFINED':
                return '#6b7280';
            case 'ENQUIRY':
                return '#f59e0b';
            default:
                return '#3b82f6';
        }
    };

    // Custom marker component
    const CustomMarker = ({ lead, onClick }) => {
        const position = { lat: lead.location.latitude, lng: lead.location.longitude };
        
        return (
            <OverlayView
                position={position}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
                <div
                    className={`custom-marker ${selectedLead?.id === lead.id ? 'selected' : ''}`}
                    onClick={() => onClick(lead)}
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${getStatusColor(lead.status)}, ${getClientTypeColor(lead.clientType)})`,
                        border: '3px solid white',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        cursor: 'pointer',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: 'white',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                    }}
                >
                    {lead.name?.charAt(0).toUpperCase()}
                </div>
            </OverlayView>
        );
    };

    // Handle marker click
    const handleMarkerClick = useCallback((lead) => {
        setSelectedLead(lead);
        if (mapInstance) {
            mapInstance.panTo({ lat: lead.location.latitude, lng: lead.location.longitude });
        }
    }, [mapInstance]);

    // Handle map load
    const handleMapLoad = useCallback((map) => {
        setMapInstance(map);
    }, []);

    // Handle redirect to lead details
    const handleViewDetails = useCallback(() => {
        if (selectedLead) {
            navigate(`/admin/leads/${selectedLead.id}`);
        }
    }, [selectedLead, navigate]);

    if (loadError) {
        return (
            <div className="leads-map-error">
                <div className="error-icon">⚠️</div>
                <h3>Error Loading Google Maps</h3>
                <p>{loadError.message}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="retry-btn"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="leads-map-loading">
                <div className="loading-spinner"></div>
                <p>Loading Google Maps...</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="leads-map-loading">
                <div className="loading-spinner"></div>
                <p>Loading leads map...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="leads-map-error">
                <div className="error-icon">⚠️</div>
                <h3>Error Loading Map</h3>
                <p>{error.message || 'Failed to load leads data'}</p>
            </div>
        );
    }

    return (
        <div className="leads-map-container">
            {/* Map Header */}
            <div className="map-header">
                <div className="map-stats">
                    <div className="stat-item">
                        <MapPin size={16} />
                        <span>{leadsWithLocation.length} Leads with Location</span>
                    </div>
                    <div className="stat-item">
                        <User size={16} />
                        <span>{totalSize} Total Leads</span>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className="map-wrapper">
                <div className="map-container" ref={mapRef}>
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={mapCenter}
                        zoom={leadsWithLocation.length > 1 ? 10 : 12}
                        options={mapOptions}
                        onLoad={handleMapLoad}
                        onClick={() => setSelectedLead(null)}
                    >
                        {/* Lead Markers */}
                        {leadsWithLocation.map((lead) => (
                            <CustomMarker
                                key={lead.id}
                                lead={lead}
                                onClick={handleMarkerClick}
                            />
                        ))}

                        {/* Info Window */}
                        {selectedLead && (
                            <InfoWindow
                                position={{
                                    lat: selectedLead.location.latitude,
                                    lng: selectedLead.location.longitude
                                }}
                                onCloseClick={() => setSelectedLead(null)}
                            >
                                <div className="info-window">
                                    <div className="info-header">
                                        <div className="info-avatar">
                                            {selectedLead.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="info-basic">
                                            <h4>{selectedLead.name}</h4>
                                            <p>{selectedLead.phone}</p>
                                            <div className="info-badges">
                                                <span 
                                                    className="status-badge"
                                                    style={{ backgroundColor: getStatusColor(selectedLead.status) }}
                                                >
                                                    {selectedLead.status}
                                                </span>
                                                <span 
                                                    className="type-badge"
                                                    style={{ backgroundColor: getClientTypeColor(selectedLead.clientType) }}
                                                >
                                                    {selectedLead.clientType}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="info-location">
                                        <MapPin size={12} />
                                        <span>{selectedLead.location.community}, {selectedLead.location.city}</span>
                                    </div>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </div>
            </div>

            {/* Lead Details Modal */}
            {selectedLead && (
                <div className="lead-modal-overlay" onClick={() => setSelectedLead(null)}>
                    <div className="lead-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Lead Details</h3>
                            <div className="modal-actions">
                                <button 
                                    className="view-details-btn"
                                    onClick={handleViewDetails}
                                    title="View Full Details"
                                >
                                    <Eye size={16} />
                                    <span>View Details</span>
                                </button>
                                <button 
                                    className="modal-close-btn"
                                    onClick={() => setSelectedLead(null)}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="modal-content">
                            {/* Lead Info */}
                            <div className="lead-info">
                                <div className="lead-avatar">
                                    {selectedLead.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="lead-basic">
                                    <h4>{selectedLead.name}</h4>
                                    <p className="lead-phone">{selectedLead.phone}</p>
                                    <div className="lead-badges">
                                        <span 
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusColor(selectedLead.status) }}
                                        >
                                            {selectedLead.status}
                                        </span>
                                        <span 
                                            className="type-badge"
                                            style={{ backgroundColor: getClientTypeColor(selectedLead.clientType) }}
                                        >
                                            {selectedLead.clientType}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Location Info */}
                            <div className="location-info">
                                <h5>Location</h5>
                                <div className="location-details">
                                    <div className="location-item">
                                        <MapPin size={14} />
                                        <span>
                                            {selectedLead.location.community}, {selectedLead.location.city}
                                        </span>
                                    </div>
                                    <div className="location-coords">
                                        <small>
                                            {selectedLead.location.latitude.toFixed(4)}, {selectedLead.location.longitude.toFixed(4)}
                                        </small>
                                    </div>
                                </div>
                            </div>

                            {/* Property Preferences */}
                            {selectedLead.preferred_property_details && selectedLead.preferred_property_details.length > 0 && (
                                <div className="property-preferences">
                                    <h5>Preferred Property</h5>
                                    {selectedLead.preferred_property_details.map((property, index) => (
                                        <div key={index} className="property-item">
                                            <div className="property-title">{property.title}</div>
                                            <div className="property-details">
                                                <span className="property-price">
                                                    {formatCurrency(property.price)}
                                                </span>
                                                <span className="property-size">
                                                    {property.size} sqft
                                                </span>
                                            </div>
                                            <div className="property-location">
                                                {property.location.community}, {property.location.city}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Budget Info */}
                            {(selectedLead.budgetFrom || selectedLead.budgetTo) && (
                                <div className="budget-info">
                                    <h5>Budget Range</h5>
                                    <div className="budget-range">
                                        {selectedLead.budgetFrom && (
                                            <span className="budget-from">
                                                From: {formatCurrency(selectedLead.budgetFrom)}
                                            </span>
                                        )}
                                        {selectedLead.budgetTo && (
                                            <span className="budget-to">
                                                To: {formatCurrency(selectedLead.budgetTo)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Agent Info */}
                            {selectedLead.agent && (
                                <div className="agent-info">
                                    <h5>Assigned Agent</h5>
                                    <div className="agent-details">
                                        <div className="agent-avatar">
                                            {selectedLead.agent.avatar ? (
                                                <img 
                                                    src={selectedLead.agent.avatar} 
                                                    alt={selectedLead.agent.name}
                                                />
                                            ) : (
                                                selectedLead.agent.name?.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div className="agent-basic">
                                            <div className="agent-name">{selectedLead.agent.name}</div>
                                            <div className="agent-contact">
                                                <div className="contact-item">
                                                    <Phone size={12} />
                                                    <span>{selectedLead.agent.phone}</span>
                                                </div>
                                                <div className="contact-item">
                                                    <Mail size={12} />
                                                    <span>{selectedLead.agent.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Lead Message */}
                            {selectedLead.leads_message && (
                                <div className="lead-message">
                                    <h5>Lead Message</h5>
                                    <div className="message-content">
                                        <MessageSquare size={14} />
                                        <p>{selectedLead.leads_message}</p>
                                    </div>
                                </div>
                            )}

                           
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default LeadsMapView;
