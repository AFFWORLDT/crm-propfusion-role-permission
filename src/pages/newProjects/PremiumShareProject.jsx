import { useParams, useSearchParams } from "react-router-dom";
import styles from "./PremiumShareProject.module.css";
import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import PageNotFound from "../PageNotFound";
import BtnCreatePdf from "../../ui/BtnCreatePdf";
import { bedroomString, formatNum } from "../../utils/utils";
import { getApiUrl } from "../../utils/getApiUrl";
import {
    Home,
    Building2,
    CalendarCheck,
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
    Calendar,
} from "lucide-react";
import useCompanySettings from "../../features/admin/general/useCompanySettings";
import axiosInstance from "../../utils/axiosInstance";

// Currency names and symbols mapping
const currencyMap = {
    AED: { name: "UAE Dirham", symbol: "AED" },
    USD: { name: "US Dollar", symbol: "$" },
    EUR: { name: "Euro", symbol: "€" },
    GBP: { name: "British Pound", symbol: "£" },
    INR: { name: "Indian Rupee", symbol: "₹" },
    PKR: { name: "Pakistani Rupee", symbol: "Rs" },
    SAR: { name: "Saudi Riyal", symbol: "SAR" },
    CAD: { name: "Canadian Dollar", symbol: "CA$" },
    AUD: { name: "Australian Dollar", symbol: "A$" },
    JPY: { name: "Japanese Yen", symbol: "¥" },
    CNY: { name: "Chinese Yuan", symbol: "¥" },
    RUB: { name: "Russian Ruble", symbol: "₽" },
    CHF: { name: "Swiss Franc", symbol: "CHF" },
    SGD: { name: "Singapore Dollar", symbol: "S$" },
    QAR: { name: "Qatari Riyal", symbol: "QAR" },
    KWD: { name: "Kuwaiti Dinar", symbol: "KWD" },
    BHD: { name: "Bahraini Dinar", symbol: "BHD" },
    OMR: { name: "Omani Rial", symbol: "OMR" },
};

const ID = "premiumPropertyDetails";

function PremiumShareProject() {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("userId");
    const isCurrent = searchParams.get("isCurrent") === "true";
    const isPdf = searchParams.get("pdf") ? true : false;
    const currency = searchParams.get("currency") || "AED";
    const rate = parseFloat(searchParams.get("rate")) || 1;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [propertyData, setPropertyData] = useState(null);
    const [selectedInterest, setSelectedInterest] = useState(null);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
    const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);
    // Add new state variables for floor plan viewer
    const [selectedFloorPlanIndex, setSelectedFloorPlanIndex] = useState(null);
    const [isFloorPlanViewerOpen, setIsFloorPlanViewerOpen] = useState(false);
    const { projectId } = useParams();
    const { data: company, isLoading: isCompanyLoading } = useCompanySettings();
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

    const currencyInfo = useMemo(() => {
        return currencyMap[currency] || { name: currency, symbol: currency };
    }, [currency]);

    const convertPrice = (price) => {
        if (!price) return 0;
        return price * rate;
    };

    useEffect(() => {
        async function fetchProject() {
            try {
                const response = await fetch(
                    `${getApiUrl()}/properties/projects?project_id=${projectId}`
                );

                if (!response.ok) throw new Error("Failed to fetch property");

                const data = await response.json();
                const projectData = {
                    company_name: "Object One Real Estate Development",
                    company_logo_url: data.projects?.[0]?.developer?.logoUrl,
                    properties: [
                        {
                            ...data.projects?.[0],
                            title: data.projects?.[0]?.name,
                            price: data.projects?.[0]?.newParam?.price,
                            size: data.projects?.[0]?.newParam?.size_min,
                            bedRooms: data.projects?.[0]?.newParam?.bedroomMin,
                            bathrooms: data.projects?.[0]?.newParam?.bedroomMin,
                            property_type:
                                data.projects?.[0]?.propertyTypes?.[0],
                            status: data.projects?.[0]?.projectStatus,
                            completionStatus: data.projects?.[0]?.newParam
                                ?.handoverTime
                                ? new Date(
                                      data.projects?.[0]?.newParam?.handoverTime
                                  ).toLocaleDateString()
                                : "N/A",
                            serviceCharge:
                                data.projects?.[0]?.newParam?.propertyFee,
                            location: {
                                property_name: data.projects?.[0]?.name,
                                sub_community:
                                    data.projects?.[0]?.location
                                        ?.sub_community || "",
                                community:
                                    data.projects?.[0]?.location?.community,
                                city: data.projects?.[0]?.location?.city,
                            },
                            developer: data.projects?.[0]?.developer,
                            agent: data.projects?.[0]?.agent,
                            amenities:
                                data.projects?.[0]?.newParam?.amenities || [],
                            photos: data.projects?.[0]?.photos || [],
                            description: data.projects?.[0]?.description,
                            floor_plans: data.projects?.[0]?.floor_plans || [],
                            payment_plans:
                                data.projects?.[0]?.payment_plans || [],
                        },
                    ],
                };
                setPropertyData(projectData);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                toast.error(err.message);
                setIsLoading(false);
            }
        }

        fetchProject();
    }, [projectId]);

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
            prev === property.photos?.length - 1 ? 0 : prev + 1
        );
    };

    const prevPhoto = () => {
        if (!property?.photos) return;
        setSelectedPhotoIndex((prev) =>
            prev === 0 ? property.photos?.length - 1 : prev - 1
        );
    };

    const openFloorPlanViewer = (index) => {
        setSelectedFloorPlanIndex(index);
        setIsFloorPlanViewerOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeFloorPlanViewer = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        setIsFloorPlanViewerOpen(false);
        document.body.style.overflow = "auto";
    };

    const nextFloorPlan = () => {
        if (!property?.floor_plans) return;
        setSelectedFloorPlanIndex((prev) =>
            prev === property.floor_plans?.length - 1 ? 0 : prev + 1
        );
    };

    const prevFloorPlan = () => {
        if (!property?.floor_plans) return;
        setSelectedFloorPlanIndex((prev) =>
            prev === 0 ? property.floor_plans?.length - 1 : prev - 1
        );
    };

    if (isLoading || isCompanyLoading) return <Spinner type="fullPage" />;
    if (error || !propertyData?.properties?.[0]) return <PageNotFound />;

    const property = propertyData?.properties?.[0];
    const amenitiesDisplay = property?.amenities || [];
    return (
        <section id={ID} className={styles.premiumShare}>
            {isPdf && (
                <BtnCreatePdf
                    id={ID}
                    fileName={
                        property?.title && property?.listingType
                            ? `${property.title.replace(/\s+/g, "_")}_${property.listingType.replace(/\s+/g, "_")}.pdf`
                            : "Project.pdf"
                    }
                />
            )}

            <div className={styles.header}>
                <div className={styles.companyInfo}>
                    <img
                        src={company?.company_logo_url}
                        alt={company?.company_name}
                    />
                    <h1>{company?.company_name}</h1>
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
                {/* <div className={styles.agentInfo}>
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
                                    handleWhatsAppClick(property?.agent?.phone)
                                }
                            >
                                <img src="/icons/whatsapp.svg" alt="WhatsApp" />
                                Connect on WhatsApp
                            </button>
                        </div>
                    </div>
                </div> */}
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
                                {currencyInfo.symbol}{" "}
                                {formatNum(convertPrice(property?.price))}
                            </span>
                            {property?.listingType === "RENT" &&
                                property?.priceType && (
                                    <span className={styles.pricePeriod}>
                                        / {property.priceType}
                                    </span>
                                )}
                        </div>
                        {currency !== "AED" && (
                            <div
                                className={styles.originalPrice}
                                style={{ fontSize: "0.85rem", color: "#666" }}
                            >
                                (AED {formatNum(property?.price)})
                            </div>
                        )}
                    </div>

                    <div className={styles.location}>
                        <MapPin size={20} />
                        <p>
                            {[
                                property?.location?.property_name,
                                property?.location?.sub_community,
                                property?.location?.community,
                                property?.location?.city,
                            ]
                                .filter(Boolean)
                                .join(", ")}
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
                    <h3>Project Details</h3>
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
                                <Ruler size={20} />
                            </div>
                            <div className={styles.detailContent}>
                                <span className={styles.detailLabel}>
                                    Size Range
                                </span>
                                <span className={styles.detailValue}>
                                    {property?.newParam?.size_min} -{" "}
                                    {property?.newParam?.size_max} sq.ft
                                </span>
                            </div>
                        </div>
                        <div className={styles.detailItem}>
                            <div className={styles.detailIcon}>
                                <BedDouble size={20} />
                            </div>
                            <div className={styles.detailContent}>
                                <span className={styles.detailLabel}>
                                    Bedrooms Range
                                </span>
                                <span className={styles.detailValue}>
                                    {property?.newParam?.bedroomMin} -{" "}
                                    {property?.newParam?.bedroomMax} Beds
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
                                    {property?.newParam?.propertyFee
                                        ? `${currencyInfo.symbol} ${formatNum(convertPrice(property.newParam.propertyFee))}`
                                        : "N/A"}
                                    {currency !== "AED" &&
                                        property?.newParam?.propertyFee && (
                                            <span
                                                style={{
                                                    fontSize: "0.85rem",
                                                    color: "#666",
                                                    display: "block",
                                                }}
                                            >
                                                (AED{" "}
                                                {formatNum(
                                                    property.newParam
                                                        .propertyFee
                                                )}
                                                )
                                            </span>
                                        )}
                                </span>
                            </div>
                        </div>
                        <div className={styles.detailItem}>
                            <div className={styles.detailIcon}>
                                <Coins size={20} />
                            </div>
                            <div className={styles.detailContent}>
                                <span className={styles.detailLabel}>
                                    Starting Price
                                </span>
                                <span className={styles.detailValue}>
                                    {property?.newParam?.price
                                        ? `${currencyInfo.symbol} ${formatNum(convertPrice(property.newParam.price))}`
                                        : "N/A"}
                                    {currency !== "AED" &&
                                        property?.newParam?.price && (
                                            <span
                                                style={{
                                                    fontSize: "0.85rem",
                                                    color: "#666",
                                                    display: "block",
                                                }}
                                            >
                                                (AED{" "}
                                                {formatNum(
                                                    property.newParam.price
                                                )}
                                                )
                                            </span>
                                        )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {property?.floor_plans?.length > 0 && (
                    <div className={styles.floorPlans}>
                        <h3>Floor Plans</h3>
                        <div className={styles.floorPlansGrid}>
                            {property.floor_plans?.map((plan, index) => (
                                <div
                                    key={plan?.id}
                                    className={styles.floorPlanCard}
                                    onClick={() => openFloorPlanViewer(index)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <img
                                        src={plan?.layout}
                                        alt={`${plan?.title} Floor Plan`}
                                    />
                                    <div className={styles.floorPlanInfo}>
                                        <h4>{plan?.title}</h4>
                                        <p>Bedrooms: {plan?.Bedroom}</p>
                                        <p>Size: {plan?.size} sq.ft</p>
                                        <p>
                                            Price: {currencyInfo.symbol}{" "}
                                            {formatNum(
                                                convertPrice(plan?.price)
                                            )}
                                        </p>
                                        {currency !== "AED" && plan?.price && (
                                            <p
                                                style={{
                                                    fontSize: "0.85rem",
                                                    color: "#666",
                                                }}
                                            >
                                                (AED {formatNum(plan?.price)})
                                            </p>
                                        )}
                                    </div>
                                    <div className={styles.galleryItemOverlay}>
                                        <img
                                            src="/icons/zoom.svg"
                                            alt="View"
                                            style={{
                                                width: "24px",
                                                height: "24px",
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {isFloorPlanViewerOpen && property?.floor_plans && (
                    <div
                        className={styles.photoViewer}
                        onClick={closeFloorPlanViewer}
                    >
                        <button
                            className={styles.closeViewer}
                            onClick={closeFloorPlanViewer}
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
                                closeFloorPlanViewer(e);
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
                                prevFloorPlan();
                            }}
                        >
                            <img src="/icons/arrow-left.svg" alt="Previous" />
                        </button>
                        <div
                            className={styles.viewerImage}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={
                                    property.floor_plans?.[
                                        selectedFloorPlanIndex
                                    ]?.layout
                                }
                                alt={`${property.floor_plans?.[selectedFloorPlanIndex]?.title} Floor Plan`}
                            />
                            <div className={styles.floorPlanViewerInfo}>
                                <h4>
                                    {
                                        property.floor_plans?.[
                                            selectedFloorPlanIndex
                                        ]?.title
                                    }
                                </h4>
                                <p>
                                    Bedrooms:{" "}
                                    {
                                        property.floor_plans?.[
                                            selectedFloorPlanIndex
                                        ]?.Bedroom
                                    }
                                </p>
                                <p>
                                    Size:{" "}
                                    {
                                        property.floor_plans?.[
                                            selectedFloorPlanIndex
                                        ]?.size
                                    }{" "}
                                    sq.ft
                                </p>
                                {property.floor_plans?.[selectedFloorPlanIndex]
                                    ?.price > 0 && (
                                    <>
                                        <p>
                                            Price: {currencyInfo.symbol}{" "}
                                            {formatNum(
                                                convertPrice(
                                                    property.floor_plans?.[
                                                        selectedFloorPlanIndex
                                                    ]?.price
                                                )
                                            )}
                                        </p>
                                        {currency !== "AED" && (
                                            <p
                                                style={{
                                                    fontSize: "0.85rem",
                                                    color: "#666",
                                                }}
                                            >
                                                (AED{" "}
                                                {formatNum(
                                                    property.floor_plans?.[
                                                        selectedFloorPlanIndex
                                                    ]?.price
                                                )}
                                                )
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        <button
                            className={styles.nextPhoto}
                            onClick={(e) => {
                                e.stopPropagation();
                                nextFloorPlan();
                            }}
                        >
                            <img src="/icons/arrow-right.svg" alt="Next" />
                        </button>
                        <div className={styles.photoCounter}>
                            {selectedFloorPlanIndex + 1} /{" "}
                            {property.floor_plans?.length}
                        </div>
                    </div>
                )}

                <div className={styles.description}>
                    <h3>Description</h3>
                    <p style={{ whiteSpace: "pre-line" }}>
                        {property?.description}
                    </p>
                </div>

                {property?.payment_plans?.length > 0 && (
                    <div className={styles.description}>
                        <h3>Payment Plan</h3>
                        <div className={styles.detailsGrid}>
                            {property.payment_plans?.map((plan) => (
                                <div
                                    key={plan?.id}
                                    className={styles.detailItem}
                                    style={{ gridColumn: "span 2" }}
                                >
                                    <div className={styles.detailIcon}>
                                        <Calendar size={20} />
                                    </div>
                                    <div className={styles.detailContent}>
                                        <span className={styles.detailLabel}>
                                            {plan?.name}
                                        </span>
                                        <div className={styles.detailValue}>
                                            {plan?.first_installment > 0 && (
                                                <p>
                                                    First Installment:{" "}
                                                    {plan?.first_installment}%
                                                </p>
                                            )}
                                            {plan?.under_construction > 0 && (
                                                <p>
                                                    Under Construction:{" "}
                                                    {plan?.under_construction}%
                                                </p>
                                            )}
                                            {plan?.on_handover > 0 && (
                                                <p>
                                                    On Handover:{" "}
                                                    {plan?.on_handover}%
                                                </p>
                                            )}
                                            {plan?.post_handover > 0 && (
                                                <p>
                                                    Post Handover:{" "}
                                                    {plan?.post_handover}%
                                                </p>
                                            )}
                                            {plan?.description && (
                                                <p style={{ color: "#666" }}>
                                                    {plan?.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <footer>
                <div className={styles.header}>
                    <div className={styles.companyInfo}>
                        <img
                            src={company?.company_logo_url}
                            alt={company?.company_name}
                        />
                        <h1>{company?.company_name}</h1>
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

export default PremiumShareProject;
