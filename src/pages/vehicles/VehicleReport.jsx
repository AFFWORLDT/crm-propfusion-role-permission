import { useParams } from "react-router-dom";
import useVehicle from "../../features/vehicles/useVehicle";
import Spinner from "../../ui/Spinner";
import PageNotFound from "../PageNotFound";
import styles from "./VehicleReport.module.css";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { X, ChevronDown, ChevronUp, CalendarIcon, CarFront, Wrench, Zap, Thermometer, Check, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";

function VehicleReport() {
    const { vehicleId } = useParams();
    const { data: vehicle, isLoading, error } = useVehicle(vehicleId);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [expandedSections, setExpandedSections] = useState({});

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    const openLightbox = (imageUrl, index) => {
        setSelectedImage(imageUrl);
        setSelectedImageIndex(index);
        // Prevent scrolling when lightbox is open
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        setSelectedImageIndex(0);
        // Re-enable scrolling
        document.body.style.overflow = 'auto';
    };

    const nextImage = (e) => {
        e.stopPropagation();
        if (vehicle?.photos?.length) {
            const nextIndex = (selectedImageIndex + 1) % vehicle.photos.length;
            setSelectedImage(vehicle.photos[nextIndex]);
            setSelectedImageIndex(nextIndex);
        }
    };

    const prevImage = (e) => {
        e.stopPropagation();
        if (vehicle?.photos?.length) {
            const prevIndex = selectedImageIndex === 0 ? vehicle.photos.length - 1 : selectedImageIndex - 1;
            setSelectedImage(vehicle.photos[prevIndex]);
            setSelectedImageIndex(prevIndex);
        }
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    if (isLoading) return <Spinner type="fullPage" />;
    if (!vehicle) return <PageNotFound />;

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderInspectionSection = (title, data, icon) => {
        if (!data) return null;
        
        const sectionId = title.replace(/\s+/g, '_').toLowerCase();
        const isExpanded = expandedSections[sectionId] !== false; // Default to expanded
        
        return (
            <div className={styles.section}>
                <div 
                    className={styles.sectionHeader} 
                    onClick={() => toggleSection(sectionId)}
                >
                    <div className={styles.sectionTitleWrapper}>
                        {icon && <span className={styles.sectionIcon}>{icon}</span>}
                        <h3>{title}</h3>
                    </div>
                    <button className={styles.expandButton}>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>
                
                {isExpanded && (
                    <div className={styles.grid}>
                        {Object.entries(data).map(([key, value]) => (
                            value !== null && (
                                <div key={key} className={styles.infoItem}>
                                    <span className={styles.label}>
                                        {key.split('_').map(word => 
                                            word.charAt(0).toUpperCase() + word.slice(1)
                                        ).join(' ')}
                                    </span>
                                    <span className={`${styles.value} ${getStatusClass(value)}`}>
                                        {typeof value === 'object' && value !== null 
                                            ? JSON.stringify(value) 
                                            : value.toString()}
                                    </span>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderTyreInspection = () => {
        if (!vehicle.tyres_inspection) return null;
        
        const sectionId = 'tyres_inspection';
        const isExpanded = expandedSections[sectionId] !== false; // Default to expanded
        
        return (
            <div className={styles.section}>
                <div 
                    className={styles.sectionHeader} 
                    onClick={() => toggleSection(sectionId)}
                >
                    <div className={styles.sectionTitleWrapper}>
                        <span className={styles.sectionIcon}><CarFront size={20} /></span>
                        <h3>Tyres Inspection</h3>
                    </div>
                    <button className={styles.expandButton}>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>
                
                {isExpanded && (
                    <div className={styles.tyresGrid}>
                        {Object.entries(vehicle.tyres_inspection).map(([position, tyre]) => (
                            <div key={position} className={styles.tyreCard}>
                                <h4>{position.split('_').map(word => 
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}</h4>
                                <div className={styles.tyreDetails}>
                                    <div className={styles.tyreInfo}>
                                        <span className={styles.label}>Manufacturer</span>
                                        <span className={styles.value}>{tyre.manufacturer || 'N/A'}</span>
                                    </div>
                                    <div className={styles.tyreInfo}>
                                        <span className={styles.label}>Production Date</span>
                                        <span className={styles.value}>{tyre.production_date || 'N/A'}</span>
                                    </div>
                                    <div className={styles.tyreInfo}>
                                        <span className={styles.label}>Condition</span>
                                        <span className={`${styles.value} ${getStatusClass(tyre.condition)}`}>
                                            {tyre.condition || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const getStatusClass = (value) => {
        if (!value || typeof value !== 'string') return '';
        
        const lowerValue = value.toLowerCase();
        
        if (lowerValue.includes('perfect')) return styles.statusPerfect;
        if (lowerValue.includes('good')) return styles.statusGood;
        if (lowerValue.includes('average')) return styles.statusAverage;
        if (lowerValue.includes('poor')) return styles.statusPoor;
        if (lowerValue.includes('needs replacement')) return styles.statusNeedsReplacement;
        if (lowerValue.includes('damaged')) return styles.statusDamaged;
        
        return '';
    };

    const getStatusIcon = (value) => {
        if (!value || typeof value !== 'string') return null;
        
        const lowerValue = value.toLowerCase();
        
        if (lowerValue.includes('perfect')) return <Check size={16} className={styles.statusIconPerfect} />;
        if (lowerValue.includes('good')) return <Check size={16} className={styles.statusIconGood} />;
        if (lowerValue.includes('needs replacement') || lowerValue.includes('poor')) 
            return <AlertTriangle size={16} className={styles.statusIconPoor} />;
        
        return null;
    };

    return (
        <div className={styles.container} id="vehicle-report">
            {selectedImage && (
                <div className={styles.lightbox} onClick={closeLightbox}>
                    <button className={styles.closeButton} onClick={closeLightbox}>
                        <X size={24} />
                    </button>
                    <button 
                        className={`${styles.lightboxNav} ${styles.prevButton}`}
                        onClick={prevImage}
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <img src={selectedImage} alt="Vehicle" />
                    </div>
                    <button 
                        className={`${styles.lightboxNav} ${styles.nextButton}`}
                        onClick={nextImage}
                    >
                        <ChevronRight size={32} />
                    </button>
                    <div className={styles.lightboxCounter}>
                        {selectedImageIndex + 1} / {vehicle?.photos?.length}
                    </div>
                </div>
            )}
            
            <div className={styles.priceBanner}>
                <div className={styles.priceTag}>
                    <span className={styles.priceLabel}>Price:</span>
                    <span className={styles.priceValue}>
                        AED {vehicle.price || "N/A"}
                        {vehicle.listingType === "RENT" && vehicle.priceType && 
                            <span className={styles.priceType}>/{vehicle.priceType}</span>
                        }
                    </span>
                </div>
                <div className={styles.listingTypeBadgeTop}>
                    {vehicle.listingType === "RENT" ? "FOR RENT" : "FOR SALE"}
                </div>
            </div>
            
            <div className={styles.header}>
                <div className={styles.reportTag}>Vehicle Inspection Report</div>
                
                <div className={styles.vehicleInfo}>
                    <h2>{vehicle.brand} {vehicle.model}</h2>
                    <div className={styles.vehicleMetaGrid}>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Reference Number</span>
                            <span className={styles.metaValue}>{vehicle.reference_number}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Inspection Date</span>
                            <span className={styles.metaValue}>
                                <CalendarIcon size={16} className={styles.metaIcon} />
                                {formatDate(vehicle.inspection_date)}
                            </span>
                        </div>
                        <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Status</span>
                            <span className={`${styles.statusBadge} ${styles.statusActive}`}>
                                {vehicle.status || "ACTIVE"}
                            </span>
                        </div>
                    </div>
                </div>
                
                {vehicle.photos && vehicle.photos.length > 0 && (
                    <div className={styles.photoGallery}>
                        {vehicle.photos.map((photo, index) => (
                            <div 
                                key={index} 
                                className={styles.photoContainer}
                                onClick={() => openLightbox(photo, index)}
                            >
                                <img 
                                    src={photo} 
                                    alt={`${vehicle.brand} ${vehicle.model} - Photo ${index + 1}`}
                                />
                                <div className={styles.photoOverlay}>
                                    <span>Click to enlarge</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.summary}>
                    <h3>Vehicle Specifications</h3>
                    <div className={styles.summaryGrid}>
                        <div className={styles.summaryItem}>
                            <span className={styles.label}>Brand</span>
                            <span className={styles.value}>{vehicle.brand || "N/A"}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.label}>Model</span>
                            <span className={styles.value}>{vehicle.model || "N/A"}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.label}>Year</span>
                            <span className={styles.value}>{vehicle.year ? formatDate(vehicle.year) : "N/A"}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.label}>Body Type</span>
                            <span className={styles.value}>{vehicle.body_type || "N/A"}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.label}>Color</span>
                            <span className={styles.value}>{vehicle.color || "N/A"}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.label}>Transmission</span>
                            <span className={styles.value}>{vehicle.transmission || "N/A"}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.label}>Fuel Type</span>
                            <span className={styles.value}>{vehicle.fuel_type || "N/A"}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.label}>Drive</span>
                            <span className={styles.value}>{vehicle.drive || "N/A"}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.label}>Odometer</span>
                            <span className={styles.value}>{vehicle.odometer_reading_km || "N/A"} km</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.label}>Engine Cylinders</span>
                            <span className={styles.value}>{vehicle.engine_cylinders || "N/A"}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.label}>Engine Size</span>
                            <span className={styles.value}>{vehicle.engine_size_liters || "N/A"} L</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.label}>Chassis Damage</span>
                            <span className={styles.value}>{vehicle.chassis_damage === true ? "Yes" : "No"}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.label}>Chassis Repaired</span>
                            <span className={styles.value}>{vehicle.chassis_repaired === true ? "Yes" : "No"}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.label}>Accident History</span>
                            <span className={styles.value}>{vehicle.accident_history === true ? "Yes" : "No"}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.label}>Bank Loan</span>
                            <span className={styles.value}>{vehicle.bank_loan === true ? "Yes" : "No"}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.label}>Navigation System</span>
                            <span className={styles.value}>{vehicle.navigation_system === true ? "Yes" : "No"}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.label}>Keys Number</span>
                            <span className={styles.value}>{vehicle.keys_number || "N/A"}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.label}>Listing Type</span>
                            <span className={styles.value}>{vehicle.listingType || "N/A"}</span>
                        </div>
                        <div className={styles.summaryItem}>
                            <span className={styles.label}>Registered In</span>
                            <span className={styles.value}>{vehicle.car_registered_in || "N/A"}</span>
                        </div>
                    </div>
                </div>

                {renderInspectionSection("Body Inspection", vehicle.body_inspection, <CarFront size={20} />)}
                {renderInspectionSection("Engine Inspection", vehicle.engine_inspection, <Zap size={20} />)}
                {renderInspectionSection("Glass Inspection", vehicle.glasses_inspection)}
                {renderInspectionSection("A/C & Heating Inspection", vehicle.ac_heating_inspection, <Thermometer size={20} />)}
                {renderInspectionSection("OBD Report", vehicle.obd_report)}
                {renderInspectionSection("Engine Compartment Inspection", vehicle.engine_compartment_inspection, <Wrench size={20} />)}
                {renderInspectionSection("Brakes Inspection", vehicle.brakes_inspection)}
                {renderInspectionSection("Electrical Controls Inspection", vehicle.electrical_controls_inspection)}
                {renderInspectionSection("Suspension & Steering Inspection", vehicle.suspension_steering_inspection)}
                {renderInspectionSection("Interiors Inspection", vehicle.interiors_inspection)}
                {renderTyreInspection()}
                {renderInspectionSection("Exteriors Inspection", vehicle.exteriors_inspection)}
                {renderInspectionSection("Road Test Inspection", vehicle.road_test_inspection)}

                {vehicle.comments && (
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h3>Additional Comments</h3>
                        </div>
                        <p className={styles.comments}>{vehicle.comments}</p>
                    </div>
                )}
            </div>
            
            <div className={styles.footer}>
                <p>© {new Date().getFullYear()} PropFusion - Vehicle Inspection Report</p>
                <p>Reference ID: {vehicleId}</p>
                <p>Generated On: {new Date().toLocaleString()}</p>
            </div>
        </div>
    );
}

export default VehicleReport; 