import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import styles from "./RequirementDetail.module.css";
import { 
    getPropertyRequirementById, 
    deletePropertyRequirement 
} from "../../services/apiRequirements";
import SectionTop from "../../ui/SectionTop";

function RequirementDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const queryClient = useQueryClient();

    // Fetch requirement details
    const { 
        data: requirement, 
        isLoading, 
        error 
    } = useQuery({
        queryKey: ["property-requirement", id],
        queryFn: () => getPropertyRequirementById(id),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: deletePropertyRequirement,
        onSuccess: () => {
            toast.success("Requirement deleted successfully!");
            queryClient.invalidateQueries(["property-requirements"]);
            navigate("/requirements");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete requirement");
        },
    });

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this requirement? This action cannot be undone.")) {
            deleteMutation.mutate(id);
        }
    };

    const formatPrice = (price) => {
        if (!price) return "N/A";
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AED',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatArray = (arr, emptyText = "None specified") => {
        if (!arr || arr.length === 0) return emptyText;
        return arr.join(", ");
    };

    if (isLoading) {
        return (
            <div className={styles.detailContainer}>
                <div className={styles.loading}>Loading requirement details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.detailContainer}>
                <div className={styles.error}>
                    Error loading requirement: {error.message}
                </div>
            </div>
        );
    }

    if (!requirement) {
        return (
            <div className={styles.detailContainer}>
                <div className={styles.error}>Requirement not found</div>
            </div>
        );
    }

    return (
        <div className="sectionContainer">
            <SectionTop heading="Requirement Details" />
            <section className="sectionStyles">
            
            {/* Hero Section */}
            <div className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <div className={styles.heroLeft}>
                        <button 
                            className={styles.backButton}
                            onClick={() => navigate("/requirements")}
                        >
                            ← Back to Requirements
                        </button>
                        <div className={styles.heroTitle}>
                            <h1>{requirement.title}</h1>
                            <div className={styles.heroMeta}>
                                <span 
                                    className={`${styles.statusBadge} ${
                                        requirement.is_active ? styles.statusActive : styles.statusInactive
                                    }`}
                                >
                                    {requirement.is_active ? "✓ Active" : "✗ Inactive"}
                                </span>
                                <span className={styles.listingType}>
                                    {requirement.listing_type ? `For ${requirement.listing_type}` : "Any Type"}
                                </span>
                            </div>
                            {requirement.description && (
                                <p className={styles.heroDescription}>{requirement.description}</p>
                            )}
                        </div>
                    </div>
                    <div className={styles.heroActions}>
                        <button 
                            className={styles.editButton}
                            onClick={() => navigate(`/requirements/${id}/edit`)}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                            </svg>
                            Edit
                        </button>
                        <button 
                            className={styles.deleteButton}
                            onClick={handleDelete}
                            disabled={deleteMutation.isLoading}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                            </svg>
                            {deleteMutation.isLoading ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className={styles.contentGrid}>
                {/* Left Column */}
                <div className={styles.leftColumn}>
                    {/* Property Types */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>🏠 Property Types</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.tagContainer}>
                                {requirement.property_types && requirement.property_types.length > 0 ? (
                                    requirement.property_types.map((type, index) => (
                                        <span key={index} className={styles.propertyTag}>
                                            {type.replace(/_/g, ' ')}
                                        </span>
                                    ))
                                ) : (
                                    <span className={styles.emptyText}>Any property type</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Property Details */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>🛏️ Property Requirements</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.detailsGrid}>
                                <div className={styles.detailItem}>
                                    <div className={styles.detailIcon}>🛏️</div>
                                    <div className={styles.detailContent}>
                                        <span className={styles.detailLabel}>Bedrooms</span>
                                        <span className={styles.detailValue}>
                                            {requirement.min_bedrooms === requirement.max_bedrooms 
                                                ? requirement.min_bedrooms || "Any"
                                                : `${requirement.min_bedrooms || 0} - ${requirement.max_bedrooms || "Any"}`}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.detailItem}>
                                    <div className={styles.detailIcon}>🚿</div>
                                    <div className={styles.detailContent}>
                                        <span className={styles.detailLabel}>Bathrooms</span>
                                        <span className={styles.detailValue}>
                                            {requirement.min_bathrooms === requirement.max_bathrooms 
                                                ? requirement.min_bathrooms || "Any"
                                                : `${requirement.min_bathrooms || 0} - ${requirement.max_bathrooms || "Any"}`}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.detailItem}>
                                    <div className={styles.detailIcon}>📐</div>
                                    <div className={styles.detailContent}>
                                        <span className={styles.detailLabel}>Size (sqft)</span>
                                        <span className={styles.detailValue}>
                                            {requirement.min_size === requirement.max_size 
                                                ? requirement.min_size || "Any"
                                                : `${requirement.min_size || 0} - ${requirement.max_size || "Any"}`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>🏊 Preferred Amenities</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.tagContainer}>
                                {requirement.amenities && requirement.amenities.length > 0 ? (
                                    requirement.amenities.map((amenity, index) => (
                                        <span key={index} className={styles.amenityTag}>
                                            {amenity}
                                        </span>
                                    ))
                                ) : (
                                    <span className={styles.emptyText}>No specific amenities required</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className={styles.rightColumn}>
                    {/* Price Range */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>💰 Budget Range</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.priceDisplay}>
                                <div className={styles.priceItem}>
                                    <span className={styles.priceLabel}>From</span>
                                    <span className={styles.priceValue}>
                                        {formatPrice(requirement.min_price)}
                                    </span>
                                </div>
                                <div className={styles.priceDivider}>—</div>
                                <div className={styles.priceItem}>
                                    <span className={styles.priceLabel}>To</span>
                                    <span className={styles.priceValue}>
                                        {formatPrice(requirement.max_price)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Locations */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>📍 Preferred Locations</h3>
                        </div>
                        <div className={styles.cardContent}>
                            {requirement.locations && requirement.locations.length > 0 ? (
                                <div className={styles.locationsList}>
                                    {requirement.locations.map((location, index) => (
                                        <div key={index} className={styles.locationItem}>
                                            <div className={styles.locationIcon}>📍</div>
                                            <div className={styles.locationDetails}>
                                                {location.city && (
                                                    <div className={styles.locationLine}>
                                                        <strong>{location.city}</strong>
                                                    </div>
                                                )}
                                                {location.community && (
                                                    <div className={styles.locationLine}>
                                                        {location.community}
                                                    </div>
                                                )}
                                                {location.sub_community && (
                                                    <div className={styles.locationLine}>
                                                        {location.sub_community}
                                                    </div>
                                                )}
                                                {location.property_name && (
                                                    <div className={styles.locationLine}>
                                                        <em>{location.property_name}</em>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <span className={styles.emptyText}>Any location</span>
                            )}
                        </div>
                    </div>

                    {/* Completion Status */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>🏗️ Completion Status</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.tagContainer}>
                                {requirement.completion_status && requirement.completion_status.length > 0 ? (
                                    requirement.completion_status.map((status, index) => (
                                        <span key={index} className={styles.statusTag}>
                                            {status.replace("_", " ").toUpperCase()}
                                        </span>
                                    ))
                                ) : (
                                    <span className={styles.emptyText}>Any completion status</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Agent & Timeline */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>ℹ️ Information</h3>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.infoList}>
                                {requirement.agent_details && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoIcon}>👤</span>
                                        <div className={styles.infoContent}>
                                            <span className={styles.infoLabel}>Agent</span>
                                            <span className={styles.infoValue}>
                                                {requirement.agent_details.name}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {requirement.created_at && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoIcon}>📅</span>
                                        <div className={styles.infoContent}>
                                            <span className={styles.infoLabel}>Created</span>
                                            <span className={styles.infoValue}>
                                                {new Date(requirement.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {requirement.updated_at && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.infoIcon}>🔄</span>
                                        <div className={styles.infoContent}>
                                            <span className={styles.infoLabel}>Last Updated</span>
                                            <span className={styles.infoValue}>
                                                {new Date(requirement.updated_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </section>
        </div>
    );
}

export default RequirementDetail;
