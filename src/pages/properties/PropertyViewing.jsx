import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getNewPropertiesByPropertyIdV2 } from "../../services/apiProperties";
import { formatNum, bedroomString } from "../../utils/utils";
import {
    MapPin,
    Bed,
    Bath,
    Square,
    Car,
    Calendar,
    Phone,
    Mail,
    Share2,
    Heart,
    ArrowLeft,
    ChevronRight,
    Star,
    CheckCircle,
    X,
    ChevronLeft,
    ChevronRight as ChevronRightIcon,
    ZoomIn,
    Building,
    Clock,
    User,
    MessageSquare,
} from "lucide-react";
import styles from "./PropertyViewing.module.css";
import Spinner from "../../ui/Spinner";
import PageNotFound from "../PageNotFound";
import toast from "react-hot-toast";
import { getApiUrl } from "../../utils/getApiUrl";

function PropertyViewing() {
    const { listingType, propertyId } = useParams();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);
    const [viewingForm, setViewingForm] = useState({
        viewing_date: "",
        duration_minutes: 60,
        notes: "",
        client_name: "",
        client_email: "",
        client_phone: "",
        status: "scheduled",
    });

    const { data, isLoading, error } = useQuery({
        queryFn: ({ signal }) =>
            getNewPropertiesByPropertyIdV2(propertyId, signal),
        queryKey: ["viewingProperty", propertyId],
        enabled: !!propertyId,
    });

    const property = data?.property;
    useEffect(() => {
        if (error) {
            toast.error("Failed to load property details");
        }
    }, [error]);

    if (isLoading) return <Spinner type="fullPage" />;
    if (!property || error) return <PageNotFound />;

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Property link copied to clipboard!");
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    const handleContact = () => {
        // This would typically open a contact form or redirect to contact
        toast.success("Contact form will open here");
    };

    const handleImageClick = (index) => {
        setSelectedImageIndex(index);
        setIsImageModalOpen(true);
    };

    const handlePreviousImage = () => {
        setSelectedImageIndex((prev) =>
            prev === 0 ? (property?.photos?.length || 1) - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setSelectedImageIndex((prev) =>
            prev === (property?.photos?.length || 1) - 1 ? 0 : prev + 1
        );
    };

    const handleCloseModal = () => {
        setIsImageModalOpen(false);
    };

    const handleViewingFormChange = (e) => {
        const { name, value } = e.target;
        setViewingForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleViewingSubmit = async (e) => {
        e.preventDefault();

        try {
            const viewingData = {
                property_id: parseInt(propertyId),
                lead_id: 0, // Default value as specified
                agent_id: property?.agent_Id || 0,
                viewing_date: viewingForm.viewing_date,
                duration_minutes: parseInt(viewingForm.duration_minutes),
                notes: viewingForm.notes,
                client_name: viewingForm.client_name,
                client_email: viewingForm.client_email,
                client_phone: viewingForm.client_phone,
                status: viewingForm.status,
            };
            const url = `${getApiUrl()}/viewings/public`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(viewingData),
            });

            if (response.ok) {
                toast.success("Viewing request submitted successfully!");
                setIsViewingModalOpen(false);
                setViewingForm({
                    viewing_date: "",
                    duration_minutes: 60,
                    notes: "",
                    client_name: "",
                    client_email: "",
                    client_phone: "",
                    status: "scheduled",
                });
            } else {
                throw new Error("Failed to submit viewing request");
            }
        } catch (error) {
            console.error("Error submitting viewing request:", error);
            toast.error("Failed to submit viewing request. Please try again.");
        }
    };

    const handleBookViewing = () => {
        setIsViewingModalOpen(true);
    };

    const formatPrice = (price) => {
        if (!price) return "Price on request";
        return `AED ${formatNum(price)}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className={styles.container}>
            {/* Header */}

            {/* Hero Section */}
            <div className={styles.hero}>
                <div className={styles.imageContainer}>
                    {property?.photos && property?.photos?.length > 0 ? (
                        <>
                            <img
                                src={property?.photos?.[selectedImageIndex]}
                                alt={property?.title || "Property"}
                                className={styles.heroImage}
                                onClick={() =>
                                    handleImageClick(selectedImageIndex)
                                }
                            />

                            {/* Image Navigation */}
                            {property?.photos?.length > 1 && (
                                <>
                                    <button
                                        className={styles.navButton}
                                        onClick={handlePreviousImage}
                                        style={{ left: "1rem" }}
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        className={styles.navButton}
                                        onClick={handleNextImage}
                                        style={{ right: "1rem" }}
                                    >
                                        <ChevronRightIcon size={24} />
                                    </button>

                                    {/* Image Counter */}
                                    <div className={styles.imageCounter}>
                                        {selectedImageIndex + 1} /{" "}
                                        {property?.photos?.length}
                                    </div>

                                    {/* Thumbnail Strip */}
                                    <div className={styles.thumbnailStrip}>
                                        {property?.photos
                                            ?.slice(0, 5)
                                            ?.map((photo, index) => (
                                                <img
                                                    key={index}
                                                    src={photo}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className={`${styles.thumbnail} ${index === selectedImageIndex ? styles.activeThumbnail : ""}`}
                                                    onClick={() =>
                                                        setSelectedImageIndex(
                                                            index
                                                        )
                                                    }
                                                />
                                            ))}
                                        {property?.photos?.length > 5 && (
                                            <div className={styles.moreImages}>
                                                +{property?.photos?.length - 5}
                                            </div>
                                        )}
                                    </div>

                                    {/* Zoom Button */}
                                    <button
                                        className={styles.zoomButton}
                                        onClick={() =>
                                            handleImageClick(selectedImageIndex)
                                        }
                                    >
                                        <ZoomIn size={20} />
                                    </button>
                                </>
                            )}
                        </>
                    ) : (
                        <div className={styles.placeholderImage}>
                            <div className={styles.placeholderContent}>
                                <span>No Image Available</span>
                            </div>
                        </div>
                    )}
                    <div className={styles.imageOverlay}>
                        <div className={styles.statusBadge}>
                            <CheckCircle size={16} />
                            {property?.status || "Available"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>
                <div className={styles.contentGrid}>
                    {/* Left Column - Property Details */}
                    <div className={styles.leftColumn}>
                        {/* Property Header */}
                        <div className={styles.propertyHeader}>
                            <h1 className={styles.title}>
                                {property?.title || "Property"}
                            </h1>
                            <div className={styles.priceSection}>
                                <span className={styles.price}>
                                    {formatPrice(property?.price)}
                                </span>
                                {property?.listingType === "RENT" && (
                                    <span className={styles.priceType}>
                                        per year
                                    </span>
                                )}
                            </div>
                            <div className={styles.location}>
                                <MapPin size={18} />
                                <span>
                                    {property?.location?.city &&
                                        `${property?.location?.city}`}
                                    {property?.location?.community &&
                                        `, ${property?.location?.community}`}
                                    {property?.location?.sub_community &&
                                        `, ${property?.location?.sub_community}`}
                                    {property?.location?.property_name &&
                                        `, ${property?.location?.property_name}`}
                                </span>
                            </div>
                        </div>

                        {/* Property Features */}
                        <div className={styles.features}>
                            <div className={styles.feature}>
                                <Bed size={20} />
                                <span>{bedroomString(property?.bedRooms)}</span>
                            </div>
                            <div className={styles.feature}>
                                <Bath size={20} />
                                <span>{property?.bathrooms || "N/A"}</span>
                            </div>
                            <div className={styles.feature}>
                                <Square size={20} />
                                <span>
                                    {property?.size
                                        ? `${property?.size} sq ft`
                                        : "N/A"}
                                </span>
                            </div>
                            {property?.parking && (
                                <div className={styles.feature}>
                                    <Car size={20} />
                                    <span>{property?.parking}</span>
                                </div>
                            )}
                            {property?.floor && (
                                <div className={styles.feature}>
                                    <Building size={20} />
                                    <span>Floor {property?.floor}</span>
                                </div>
                            )}
                        </div>

                        {/* Property Description */}
                        {property?.description && (
                            <div className={styles.section}>
                                <h3>Description</h3>
                                <p className={styles.description}>
                                    {property?.description}
                                </p>
                            </div>
                        )}

                        {/* Property Details */}
                        <div className={styles.section}>
                            <h3>Property Details</h3>
                            <div className={styles.detailsGrid}>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                        Property Type
                                    </span>
                                    <span className={styles.detailValue}>
                                        {property?.property_type || "N/A"}
                                    </span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                        Furnishing
                                    </span>
                                    <span className={styles.detailValue}>
                                        {property?.isFurnished || "N/A"}
                                    </span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                        Floor
                                    </span>
                                    <span className={styles.detailValue}>
                                        {property?.floor || "N/A"}
                                    </span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                        Reference ID
                                    </span>
                                    <span className={styles.detailValue}>
                                        {property?.propertyId || "N/A"}
                                    </span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                        Build Year
                                    </span>
                                    <span className={styles.detailValue}>
                                        {property?.buildYear || "N/A"}
                                    </span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                        Completion Status
                                    </span>
                                    <span className={styles.detailValue}>
                                        {property?.completionStatus || "N/A"}
                                    </span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                        House Number
                                    </span>
                                    <span className={styles.detailValue}>
                                        {property?.houseNo || "N/A"}
                                    </span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                        Total Floors
                                    </span>
                                    <span className={styles.detailValue}>
                                        {property?.totalFloor || "N/A"}
                                    </span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                        Listed Date
                                    </span>
                                    <span className={styles.detailValue}>
                                        {formatDate(property?.createTime)}
                                    </span>
                                </div>
                                <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>
                                        Last Updated
                                    </span>
                                    <span className={styles.detailValue}>
                                        {formatDate(property?.lastUpdate)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Additional Features */}
                        {property?.features &&
                            property?.features?.length > 0 && (
                                <div className={styles.section}>
                                    <h3>Features & Amenities</h3>
                                    <div className={styles.featuresList}>
                                        {property?.features?.map(
                                            (feature, index) => (
                                                <div
                                                    key={index}
                                                    className={
                                                        styles.featureItem
                                                    }
                                                >
                                                    <CheckCircle size={16} />
                                                    <span>{feature}</span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        {/* Image Gallery */}
                        {property?.photos && property?.photos?.length > 1 && (
                            <div className={styles.section}>
                                <h3>
                                    Gallery ({property?.photos?.length} photos)
                                </h3>
                                <div className={styles.gallery}>
                                    {property?.photos?.map((photo, index) => (
                                        <div
                                            key={index}
                                            className={styles.galleryItem}
                                            onClick={() =>
                                                handleImageClick(index)
                                            }
                                        >
                                            <img
                                                src={photo}
                                                alt={`${property?.title || "Property"} - Image ${index + 1}`}
                                            />
                                            <div
                                                className={
                                                    styles.galleryOverlay
                                                }
                                            >
                                                <ZoomIn size={24} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Contact & Actions */}
                    <div className={styles.rightColumn}>
                        {/* Contact Card */}
                        <div className={styles.contactCard}>
                            <div className={styles.buttonGroup}>
                                <button
                                    className={styles.primaryButton}
                                    onClick={handleBookViewing}
                                >
                                    <Calendar size={20} />
                                    Book Viewing
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className={styles.statsCard}>
                            <h4>Property Stats</h4>
                            <div className={styles.statsList}>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>
                                        Views
                                    </span>
                                    <span className={styles.statValue}>
                                        1,234
                                    </span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>
                                        Favorites
                                    </span>
                                    <span className={styles.statValue}>56</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>
                                        Days Listed
                                    </span>
                                    <span className={styles.statValue}>15</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            {isImageModalOpen && property?.photos && (
                <div className={styles.imageModal} onClick={handleCloseModal}>
                    <div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className={styles.closeButton}
                            onClick={handleCloseModal}
                        >
                            <X size={24} />
                        </button>

                        <div className={styles.modalImageContainer}>
                            <img
                                src={property?.photos?.[selectedImageIndex]}
                                alt={`${property?.title || "Property"} - Image ${selectedImageIndex + 1}`}
                                className={styles.modalImage}
                            />

                            {property?.photos?.length > 1 && (
                                <>
                                    <button
                                        className={styles.modalNavButton}
                                        onClick={handlePreviousImage}
                                        style={{ left: "1rem" }}
                                    >
                                        <ChevronLeft size={32} />
                                    </button>
                                    <button
                                        className={styles.modalNavButton}
                                        onClick={handleNextImage}
                                        style={{ right: "1rem" }}
                                    >
                                        <ChevronRightIcon size={32} />
                                    </button>

                                    <div className={styles.modalImageCounter}>
                                        {selectedImageIndex + 1} /{" "}
                                        {property?.photos?.length}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Navigation */}
                        {property?.photos?.length > 1 && (
                            <div className={styles.modalThumbnails}>
                                {property?.photos?.map((photo, index) => (
                                    <img
                                        key={index}
                                        src={photo}
                                        alt={`Thumbnail ${index + 1}`}
                                        className={`${styles.modalThumbnail} ${index === selectedImageIndex ? styles.activeModalThumbnail : ""}`}
                                        onClick={() =>
                                            setSelectedImageIndex(index)
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Viewing Booking Modal */}
            {isViewingModalOpen && (
                <div
                    className={styles.viewingModal}
                    onClick={() => setIsViewingModalOpen(false)}
                >
                    <div
                        className={styles.viewingModalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.viewingModalHeader}>
                            <h3>Book Property Viewing</h3>
                            <button
                                className={styles.viewingCloseButton}
                                onClick={() => setIsViewingModalOpen(false)}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleViewingSubmit}
                            className={styles.viewingForm}
                        >
                            <div className={styles.formGroup}>
                                <label htmlFor="client_name">
                                    <User size={16} />
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="client_name"
                                    name="client_name"
                                    value={viewingForm.client_name}
                                    onChange={handleViewingFormChange}
                                    required
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="client_email">
                                    <Mail size={16} />
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="client_email"
                                    name="client_email"
                                    value={viewingForm.client_email}
                                    onChange={handleViewingFormChange}
                                    required
                                    placeholder="Enter your email address"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="client_phone">
                                    <Phone size={16} />
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    id="client_phone"
                                    name="client_phone"
                                    value={viewingForm.client_phone}
                                    onChange={handleViewingFormChange}
                                    required
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="viewing_date">
                                    <Calendar size={16} />
                                    Preferred Date & Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    id="viewing_date"
                                    name="viewing_date"
                                    value={viewingForm.viewing_date}
                                    onChange={handleViewingFormChange}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="duration_minutes">
                                    <Clock size={16} />
                                    Duration (minutes)
                                </label>
                                <select
                                    id="duration_minutes"
                                    name="duration_minutes"
                                    value={viewingForm.duration_minutes}
                                    onChange={handleViewingFormChange}
                                >
                                    <option value={30}>30 minutes</option>
                                    <option value={60}>1 hour</option>
                                    <option value={90}>1.5 hours</option>
                                    <option value={120}>2 hours</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="notes">
                                    <MessageSquare size={16} />
                                    Additional Notes
                                </label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={viewingForm.notes}
                                    onChange={handleViewingFormChange}
                                    placeholder="Any specific requirements or questions..."
                                    rows={4}
                                />
                            </div>

                            <div className={styles.formActions}>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={() => setIsViewingModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                >
                                    <Calendar size={16} />
                                    Book Viewing
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PropertyViewing;
