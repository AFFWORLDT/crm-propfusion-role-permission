import { useSearchParams } from "react-router-dom";
import styles from "./PremiumShare.module.css";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Spinner from "../../../ui/Spinner";
import PageNotFound from "../../PageNotFound";
import BtnCreatePdf from "../../../ui/BtnCreatePdf";
import { bedroomString, formatNum } from "../../../utils/utils";
import { getApiUrl } from "../../../utils/getApiUrl";
import {
    Home,
    Building2,
    CalendarCheck,
    Sofa,
    Car,
    CheckCircle2,
    XCircle,
    Wallet,
    Coins,
    MapPin,
    BedDouble,
    Bath,
    Ruler,
    Image as ImageIcon,
    ThumbsUp,
    Info,
    ThumbsDown,
} from "lucide-react";
import useAllDetails from "../../../features/all-details/useAllDetails";
import axiosInstance from "../../../utils/axiosInstance";

const ID = "premiumPropertyDetails";

function PremiumShareProperty() {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("userId");
    const isCurrent = searchParams.get("isCurrent") === "true";
    const isPdf = searchParams.get("pdf") ? true : false;
    const currency = searchParams.get("currency") || "AED";
    const rate = searchParams.get("rate")
        ? parseFloat(searchParams.get("rate"))
        : 1;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [propertyData, setPropertyData] = useState(null);
    const [selectedInterest, setSelectedInterest] = useState(null);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
    const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState();

    const fetchCurrentUser = async () => {
        try {
            const { data } = await axiosInstance.get(`/agent/${userId}`);
            setCurrentUser(data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (userId && isCurrent) {
            fetchCurrentUser();
        }
    }, [userId, isCurrent]);
    useEffect(() => {
        async function fetchProperty() {
            try {
                const propertyId = window.location.pathname.split("/").pop();
                const response = await fetch(
                    `${getApiUrl()}/properties/get_properties_for_sharing?property_id=${propertyId}`
                );

                if (!response.ok) throw new Error("Failed to fetch property");

                const data = await response.json();
                setPropertyData(data);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                toast.error(err.message);
                setIsLoading(false);
            }
        }

        fetchProperty();
    }, []);

    // Function to convert price based on rate
    const convertPrice = (price) => {
        if (!price) return 0;
        return Math.round(price * rate);
    };

    const handleInterestClick = (interest) => {
        setSelectedInterest(interest);
        toast.success(
            `Thank you for your feedback! We'll get back to you soon.`
        );
    };

    const handleWhatsAppClick = (phone) => {
        if (!phone) return;
        const message = `Hi, I'm interested in the property: ${property?.title || ""}`;
        window.open(
            `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`,
            "_blank"
        );
    };

    const openPhotoViewer = (index) => {
        setSelectedPhotoIndex(index);
        setIsPhotoViewerOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closePhotoViewer = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        setIsPhotoViewerOpen(false);
        document.body.style.overflow = "auto";
    };

    const nextPhoto = () => {
        if (!property?.photos) return;
        setSelectedPhotoIndex((prev) =>
            prev === property.photos.length - 1 ? 0 : prev + 1
        );
    };

    const prevPhoto = () => {
        if (!property?.photos) return;
        setSelectedPhotoIndex((prev) =>
            prev === 0 ? property.photos.length - 1 : prev - 1
        );
    };

    if (isLoading) return <Spinner type="fullPage" />;
    if (error || !propertyData?.properties?.[0]) return <PageNotFound />;

    const property = propertyData?.properties?.[0];
    const amenitiesDisplay = property?.amenities || [];
    console.log(currentUser);
    return (
        <section id={ID} className={styles.premiumShare}>
            {isPdf && (
                <BtnCreatePdf
                    id={ID}
                    fileName={
                        property?.title && property?.listingType
                            ? `${property.title.replace(/\s+/g, "_")}_${property.listingType.replace(/\s+/g, "_")}.pdf`
                            : "Property.pdf"
                    }
                />
            )}

            <div className={styles.header}>
                <div className={styles.companyInfo}>
                    <img
                        src={propertyData?.company_logo_url}
                        alt="Company Logo"
                    />
                    <h1>{propertyData?.company_name}</h1>
                </div>
                {isCurrent ? (
                    <div className={styles.agentInfo}>
                        <img src={currentUser?.avatar} alt="Agent" />
                        <div>
                            <h2>{currentUser?.name}</h2>
                            <p>
                                <img
                                    src="/icons/phone.svg"
                                    alt="Phone"
                                    width="16"
                                    height="16"
                                />
                                {currentUser?.phone}
                            </p>
                            <p>
                                <img
                                    src="/icons/email.svg"
                                    alt="Email"
                                    width="16"
                                    height="16"
                                />
                                {currentUser?.email}
                            </p>
                            <div className={styles.agentConnect}>
                                <button
                                    className={styles.whatsappBtn}
                                    onClick={() =>
                                        handleWhatsAppClick(currentUser?.phone)
                                    }
                                >
                                    <img
                                        src="/icons/whatsapp.svg"
                                        alt="WhatsApp"
                                    />
                                    Connect on WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.agentInfo}>
                        <img src={property?.agent?.avatar} alt="Agent" />
                        <div>
                            <h2>{property?.agent?.name}</h2>
                            <p>
                                <img
                                    src="/icons/phone.svg"
                                    alt="Phone"
                                    width="16"
                                    height="16"
                                />
                                {property?.agent?.phone}
                            </p>
                            <p>
                                <img
                                    src="/icons/email.svg"
                                    alt="Email"
                                    width="16"
                                    height="16"
                                />
                                {property?.agent?.email}
                            </p>
                            <div className={styles.agentConnect}>
                                <button
                                    className={styles.whatsappBtn}
                                    onClick={() =>
                                        handleWhatsAppClick(
                                            property?.agent?.phone
                                        )
                                    }
                                >
                                    <img
                                        src="/icons/whatsapp.svg"
                                        alt="WhatsApp"
                                    />
                                    Connect on WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.propertyHero}>
                <div
                    className={styles.mainImage}
                    onClick={() => openPhotoViewer(0)}
                >
                    <img src={property?.photos?.[0]} alt="Property" />
                    <div className={styles.propertyStatus}>
                        <span className={styles.statusBadge}>
                            {property?.status}
                        </span>
                        <span className={styles.propertyType}>
                            {property?.property_type}
                        </span>
                    </div>
                    <div className={styles.viewAllPhotos}>
                        <ImageIcon size={20} />
                        <span>View All Photos</span>
                    </div>
                </div>
                <div className={styles.propertyInfo}>
                    <div className={styles.propertyHeader}>
                        <h1 className={styles.propertyTitle}>
                            {property?.title}
                        </h1>
                        <div className={styles.price}>
                            <span className={styles.priceAmount}>
                                {currency}{" "}
                                {formatNum(convertPrice(property?.price))}
                            </span>
                            {property?.listingType === "RENT" &&
                                property?.priceType && (
                                    <span className={styles.pricePeriod}>
                                        / {property.priceType}
                                    </span>
                                )}
                        </div>
                    </div>

                    <div className={styles.location}>
                        <MapPin size={20} />
                        <p>
                            {(() => {
                                const locationParts = [
                                    property?.location?.property_name,
                                    property?.location?.sub_community,
                                    property?.location?.community,
                                    property?.location?.city,
                                ].filter(Boolean);

                                if (locationParts.length === 0) {
                                    return "Location information not available";
                                }

                                return locationParts.join(", ");
                            })()}
                        </p>
                    </div>

                    <div className={styles.propertyDetails}>
                        <div className={styles.propertyDetail}>
                            <BedDouble size={24} />
                            <span>
                                {bedroomString(property?.bedRooms)} Beds
                            </span>
                        </div>
                        <div className={styles.propertyDetail}>
                            <Bath size={24} />
                            <span>{property?.bathrooms} Baths</span>
                        </div>
                        <div className={styles.propertyDetail}>
                            <Ruler size={24} />
                            <span>{property?.size} sq.ft</span>
                        </div>
                    </div>

                    {/* Property Location Map */}
                    {property?.location?.latitude &&
                    property?.location?.longitude ? (
                        <div className={styles.mapSection}>
                            <h3 className={styles.mapTitle}>
                                Property Location
                            </h3>
                            <div className={styles.mapContainer}>
                                <iframe
                                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${property.location.latitude},${property.location.longitude}&zoom=15`}
                                    width="100%"
                                    height="300"
                                    style={{ border: 0, borderRadius: "12px" }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Property Location"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className={styles.mapSection}>
                            <h3 className={styles.mapTitle}>
                                Property Location
                            </h3>
                            <div className={styles.mapPlaceholder}>
                                <MapPin size={48} />
                                <p>
                                    Map will be available once location
                                    coordinates are updated
                                </p>
                                <small>
                                    Location:{" "}
                                    {property?.location?.city || "City"},{" "}
                                    {property?.location?.community ||
                                        "Community"}
                                </small>
                            </div>
                        </div>
                    )}

                    <div className={styles.interestSection}>
                        <h3 className={styles.interestTitle}>
                            Are you interested in this property?
                        </h3>
                        <div className={styles.interestButtons}>
                            <button
                                className={`${styles.interestBtn} ${selectedInterest === "interested" ? styles.selected : ""}`}
                                onClick={() =>
                                    handleInterestClick("interested")
                                }
                            >
                                <ThumbsUp size={20} />
                                <span>Interested</span>
                            </button>
                            <button
                                className={`${styles.interestBtn} ${selectedInterest === "need-more-info" ? styles.selected : ""}`}
                                onClick={() =>
                                    handleInterestClick("need-more-info")
                                }
                            >
                                <Info size={20} />
                                <span>Need More Info</span>
                            </button>
                            <button
                                className={`${styles.interestBtn} ${selectedInterest === "not-interested" ? styles.selected : ""}`}
                                onClick={() =>
                                    handleInterestClick("not-interested")
                                }
                            >
                                <ThumbsDown size={20} />
                                <span>Not Interested</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.gallery}>
                {property?.photos?.slice(1).map((photo, index) => (
                    <div
                        key={index}
                        className={styles.galleryItem}
                        onClick={() => openPhotoViewer(index + 1)}
                    >
                        <img src={photo} alt={`Property ${index + 2}`} />
                        <div className={styles.galleryItemOverlay}>
                            <img src="/icons/zoom.svg" alt="View" />
                        </div>
                    </div>
                ))}
            </div>

            {isPhotoViewerOpen && (
                <div className={styles.photoViewer} onClick={closePhotoViewer}>
                    <button
                        className={styles.closeViewer}
                        onClick={closePhotoViewer}
                        style={{
                            position: "absolute",
                            top: "20px",
                            right: "20px",
                            zIndex: 9999,
                            width: "48px",
                            height: "48px",
                            background: "rgba(0, 0, 0, 0.7)",
                            border: "none",
                            borderRadius: "50%",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0",
                        }}
                        onTouchStart={(e) => e.stopPropagation()}
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            closePhotoViewer(e);
                        }}
                    >
                        <img
                            src="/icons/close.svg"
                            alt="Close"
                            style={{
                                width: "24px",
                                height: "24px",
                            }}
                        />
                    </button>
                    <button
                        className={styles.prevPhoto}
                        onClick={(e) => {
                            e.stopPropagation();
                            prevPhoto();
                        }}
                    >
                        <img src="/icons/arrow-left.svg" alt="Previous" />
                    </button>
                    <div
                        className={styles.viewerImage}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={property?.photos?.[selectedPhotoIndex]}
                            alt={`Property ${selectedPhotoIndex + 1}`}
                        />
                    </div>
                    <button
                        className={styles.nextPhoto}
                        onClick={(e) => {
                            e.stopPropagation();
                            nextPhoto();
                        }}
                    >
                        <img src="/icons/arrow-right.svg" alt="Next" />
                    </button>
                    <div className={styles.photoCounter}>
                        {selectedPhotoIndex + 1} / {property?.photos?.length}
                    </div>
                </div>
            )}

            <div className={styles.details}>
                <div className={styles.amenities}>
                    <h3>Property Details</h3>
                    <div className={styles.detailsGrid}>
                        <div className={styles.detailItem}>
                            <div className={styles.detailIcon}>
                                <Home size={20} />
                            </div>
                            <div className={styles.detailContent}>
                                <span className={styles.detailLabel}>
                                    Property Type
                                </span>
                                <span className={styles.detailValue}>
                                    {property?.property_type}
                                </span>
                            </div>
                        </div>
                        <div className={styles.detailItem}>
                            <div className={styles.detailIcon}>
                                <Building2 size={20} />
                            </div>
                            <div className={styles.detailContent}>
                                <span className={styles.detailLabel}>
                                    Developer
                                </span>
                                <span className={styles.detailValue}>
                                    {property?.developer?.name || "N/A"}
                                </span>
                            </div>
                        </div>
                        <div className={styles.detailItem}>
                            <div className={styles.detailIcon}>
                                <CalendarCheck size={20} />
                            </div>
                            <div className={styles.detailContent}>
                                <span className={styles.detailLabel}>
                                    Completion Status
                                </span>
                                <span className={styles.detailValue}>
                                    {property?.completionStatus || "N/A"}
                                </span>
                            </div>
                        </div>
                        <div className={styles.detailItem}>
                            <div className={styles.detailIcon}>
                                <Sofa size={20} />
                            </div>
                            <div className={styles.detailContent}>
                                <span className={styles.detailLabel}>
                                    Furnishing
                                </span>
                                <span className={styles.detailValue}>
                                    {property?.isFurnished ? (
                                        <CheckCircle2
                                            size={16}
                                            color="#22c55e"
                                        />
                                    ) : (
                                        <XCircle size={16} color="#ef4444" />
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className={styles.detailItem}>
                            <div className={styles.detailIcon}>
                                <Car size={20} />
                            </div>
                            <div className={styles.detailContent}>
                                <span className={styles.detailLabel}>
                                    Parking
                                </span>
                                <span className={styles.detailValue}>
                                    {property?.parking || "N/A"}
                                </span>
                            </div>
                        </div>
                        <div className={styles.detailItem}>
                            <div className={styles.detailIcon}>
                                <Wallet size={20} />
                            </div>
                            <div className={styles.detailContent}>
                                <span className={styles.detailLabel}>
                                    Service Charge
                                </span>
                                <span className={styles.detailValue}>
                                    {property?.serviceCharge
                                        ? `${currency} ${formatNum(convertPrice(property.serviceCharge))}`
                                        : "N/A"}
                                </span>
                            </div>
                        </div>
                        <div className={styles.detailItem}>
                            <div className={styles.detailIcon}>
                                <Coins size={20} />
                            </div>
                            <div className={styles.detailContent}>
                                <span className={styles.detailLabel}>
                                    Price
                                </span>
                                <span className={styles.detailValue}>
                                    {property?.price
                                        ? `${currency} ${formatNum(convertPrice(property.price))}`
                                        : "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {amenitiesDisplay.length > 0 && (
                    <div className={styles.amenities}>
                        <h3>Amenities</h3>
                        <div className={styles.amenitiesGrid}>
                            {amenitiesDisplay.map((amenity, index) => (
                                <div key={index} className={styles.amenityItem}>
                                    <span>{amenity?.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className={styles.description}>
                    <h3>Description</h3>
                    <p>{property?.description}</p>
                </div>
            </div>

            <footer>
                <div className={styles.header}>
                    <div className={styles.companyInfo}>
                        <img
                            src={propertyData?.company_logo_url}
                            alt="Company Logo"
                        />
                        <h1>{propertyData?.company_name}</h1>
                    </div>
                    {isCurrent ? (
                        <div className={styles.agentInfo}>
                            <img src={currentUser?.avatar} alt="Agent" />
                            <div>
                                <h2>{currentUser?.name}</h2>
                                <p>
                                    <img
                                        src="/icons/phone.svg"
                                        alt="Phone"
                                        width="16"
                                        height="16"
                                    />
                                    {currentUser?.phone}
                                </p>
                                <p>
                                    <img
                                        src="/icons/email.svg"
                                        alt="Email"
                                        width="16"
                                        height="16"
                                    />
                                    {currentUser?.email}
                                </p>
                                <div className={styles.agentConnect}>
                                    <button
                                        className={styles.whatsappBtn}
                                        onClick={() =>
                                            handleWhatsAppClick(
                                                currentUser?.phone
                                            )
                                        }
                                    >
                                        <img
                                            src="/icons/whatsapp.svg"
                                            alt="WhatsApp"
                                        />
                                        Connect on WhatsApp
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.agentInfo}>
                            <img src={property?.agent?.avatar} alt="Agent" />
                            <div>
                                <h2>{property?.agent?.name}</h2>
                                <p>
                                    <img
                                        src="/icons/phone.svg"
                                        alt="Phone"
                                        width="16"
                                        height="16"
                                    />
                                    {property?.agent?.phone}
                                </p>
                                <p>
                                    <img
                                        src="/icons/email.svg"
                                        alt="Email"
                                        width="16"
                                        height="16"
                                    />
                                    {property?.agent?.email}
                                </p>
                                <div className={styles.agentConnect}>
                                    <button
                                        className={styles.whatsappBtn}
                                        onClick={() =>
                                            handleWhatsAppClick(
                                                property?.agent?.phone
                                            )
                                        }
                                    >
                                        <img
                                            src="/icons/whatsapp.svg"
                                            alt="WhatsApp"
                                        />
                                        Connect on WhatsApp
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </footer>
        </section>
    );
}

export default PremiumShareProperty;
