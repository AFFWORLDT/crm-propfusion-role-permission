import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "./../../../utils/axiosInstance";
import styles from "./PropertyGallery.module.css";

function PropertyGallery() {
    const { listType } = useParams();
    const [properties, setProperties] = useState([]);
    const [showDetails, setShowDetails] = useState(true); // show on load
    const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [imageTransition, setImageTransition] = useState(false);

    const fetchAllProperties = async () => {
        try {
            setIsLoading(true);
            const res = await axiosInstance.get(
                `properties/get_new_properties?size=1000&listing_type=${listType}&status=ACTIVE`
            );
            setProperties(res?.data?.properties || []);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllProperties();
    }, [listType]);

    // Auto-hide controls like video player
    useEffect(() => {
        let hideTimeout;

        const handleMouseMove = () => {
            setShowDetails(true);
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                setShowDetails(false);
            }, 5000); // hide after 5s of inactivity
        };

        window.addEventListener("mousemove", handleMouseMove);

        // Initial hide after 5s
        hideTimeout = setTimeout(() => setShowDetails(false), 5000);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            clearTimeout(hideTimeout);
        };
    }, []);

    // Filter properties that have images
    const propertiesWithImages = properties.filter(
        (property) =>
            property.photos &&
            Array.isArray(property.photos) &&
            property.photos.length > 0
    );

    // Get current property images
    const getCurrentPropertyImages = () => {
        if (!propertiesWithImages[currentPropertyIndex]?.photos) return [];
        return Array.isArray(propertiesWithImages[currentPropertyIndex].photos)
            ? propertiesWithImages[currentPropertyIndex].photos
            : [];
    };

    const currentImages = getCurrentPropertyImages();
    const currentProperty = propertiesWithImages[currentPropertyIndex];

    // Enhanced auto-play functionality
    useEffect(() => {
        if (!isAutoPlay || propertiesWithImages.length === 0) return;

        const interval = setInterval(() => {
            setImageTransition(true);

            setTimeout(() => {
                setCurrentImageIndex((prevImageIndex) => {
                    const hasMoreImages =
                        prevImageIndex < currentImages.length - 1;

                    if (hasMoreImages) {
                        return prevImageIndex + 1;
                    } else {
                        setCurrentPropertyIndex((prevPropIndex) => {
                            return prevPropIndex ===
                                propertiesWithImages.length - 1
                                ? 0
                                : prevPropIndex + 1;
                        });
                        return 0;
                    }
                });
                setImageTransition(false);
            }, 150);
        }, 4000);

        return () => clearInterval(interval);
    }, [
        isAutoPlay,
        currentImages.length,
        propertiesWithImages.length,
        currentPropertyIndex,
    ]);

    // Reset image index when property changes manually
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [currentPropertyIndex]);

    // Navigation handlers
    const handleNextProperty = useCallback(() => {
        setImageTransition(true);
        setTimeout(() => {
            setCurrentPropertyIndex((prev) =>
                prev === propertiesWithImages.length - 1 ? 0 : prev + 1
            );
            setCurrentImageIndex(0);
            setImageTransition(false);
        }, 150);
    }, [propertiesWithImages.length]);

    const handlePrevProperty = useCallback(() => {
        setImageTransition(true);
        setTimeout(() => {
            setCurrentPropertyIndex((prev) =>
                prev === 0 ? propertiesWithImages.length - 1 : prev - 1
            );
            setCurrentImageIndex(0);
            setImageTransition(false);
        }, 150);
    }, [propertiesWithImages.length]);

    const handleNextImage = useCallback(() => {
        setImageTransition(true);
        setTimeout(() => {
            setCurrentImageIndex((prev) => {
                if (prev === currentImages.length - 1) {
                    setCurrentPropertyIndex((prevProp) =>
                        prevProp === propertiesWithImages.length - 1
                            ? 0
                            : prevProp + 1
                    );
                    return 0;
                }
                return prev + 1;
            });
            setImageTransition(false);
        }, 150);
    }, [currentImages.length, propertiesWithImages.length]);

    const handlePrevImage = useCallback(() => {
        setImageTransition(true);
        setTimeout(() => {
            setCurrentImageIndex((prev) => {
                if (prev === 0) {
                    const prevPropIndex =
                        currentPropertyIndex === 0
                            ? propertiesWithImages.length - 1
                            : currentPropertyIndex - 1;
                    setCurrentPropertyIndex(prevPropIndex);
                    const prevPropertyImages =
                        propertiesWithImages[prevPropIndex]?.photos || [];
                    return Math.max(0, prevPropertyImages.length - 1);
                }
                return prev - 1;
            });
            setImageTransition(false);
        }, 150);
    }, [currentPropertyIndex, propertiesWithImages]);

    // Format price
    const formatPrice = (price, priceType, listingType) => {
        const formattedPrice = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "AED",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);

        if (listingType === "RENT") {
            return `${formattedPrice}/${priceType?.toLowerCase() || "month"}`;
        }
        return formattedPrice;
    };

    // Get location text
    const getLocationText = (location) => {
        const parts = [
            location?.sub_community,
            location?.community,
            location?.city,
        ].filter(Boolean);
        return parts.join(", ");
    };

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading properties...</p>
            </div>
        );
    }

    if (propertiesWithImages.length === 0) {
        return (
            <div className={styles.loading}>
                <h2>No properties with images found</h2>
                <p>All properties are missing images</p>
            </div>
        );
    }

    return (
        <div className={styles.gallery}>
            {/* Main Image Display */}
            <div className={styles.imageContainer}>
                <div className={styles.imageWrapper}>
                    <img
                        src={currentImages[currentImageIndex]}
                        alt={currentProperty?.title || "Property"}
                        className={`${styles.mainImage} ${imageTransition ? styles.transitioning : ""}`}
                        onError={(e) => {
                            console.log(
                                "Image failed to load:",
                                currentImages[currentImageIndex]
                            );
                            e.target.src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+";
                        }}
                    />
                    <div className={styles.imageOverlay}></div>
                </div>

                {/* Image Navigation Arrows */}
                {showDetails && currentImages.length > 1 && (
                    <>
                        <button
                            className={`${styles.navBtn} ${styles.prevBtn}`}
                            onClick={handlePrevImage}
                            aria-label="Previous image"
                        >
                            ‹
                        </button>
                        <button
                            className={`${styles.navBtn} ${styles.nextBtn}`}
                            onClick={handleNextImage}
                            aria-label="Next image"
                        >
                            ›
                        </button>
                    </>
                )}

                {/* Image Counter */}
                {showDetails && (
                    <div className={styles.imageCounter}>
                        {currentImageIndex + 1} / {currentImages.length}
                    </div>
                )}
            </div>

            {/* Property Info Overlay */}
            <div className={styles.propertyInfo}>
                <div className={styles.propertyHeader}>
                    <h2 className={styles.propertyTitle}>
                        {currentProperty?.title}
                    </h2>
                    <div className={styles.propertyPrice}>
                        {formatPrice(
                            currentProperty?.price,
                            currentProperty?.priceType,
                            currentProperty?.listingType
                        )}
                    </div>
                </div>
                <div className={styles.propertyDetails}>
                    <span>{currentProperty?.bedRooms} Bed</span>
                    <span>{currentProperty?.bathrooms} Bath</span>
                    <span>{currentProperty?.size} sq ft</span>
                    <span className={styles.propertyType}>
                        {currentProperty?.property_type}
                    </span>
                </div>
                <p className={styles.propertyLocation}>
                    📍 {getLocationText(currentProperty?.location)}
                </p>
                {currentProperty?.agent && (
                    <div className={styles.agentInfo}>
                        <div className={styles.agentDetails}>
                            {currentProperty.agent.avatar && (
                                <img
                                    src={currentProperty.agent.avatar}
                                    alt={currentProperty.agent.name}
                                    className={styles.agentAvatar}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Controls */}
            {showDetails && (
                <div className={styles.controls}>
                    <button
                        className={`${styles.controlBtn} ${styles.nextPropertyBtn}`}
                        onClick={handlePrevProperty}
                        aria-label="Previous property"
                    >
                        ← Prev Property
                    </button>

                    <button
                        className={`${styles.controlBtn} ${styles.autoPlayBtn} ${isAutoPlay ? styles.playing : styles.paused}`}
                        onClick={() => setIsAutoPlay(!isAutoPlay)}
                        aria-label={
                            isAutoPlay ? "Pause slideshow" : "Play slideshow"
                        }
                    >
                        {isAutoPlay ? "⏸️ Pause" : "▶️ Play"}
                    </button>

                    <button
                        className={`${styles.controlBtn} ${styles.nextPropertyBtn}`}
                        onClick={handleNextProperty}
                        aria-label="Next property"
                    >
                        Next Property →
                    </button>
                </div>
            )}

            {/* Property Progress Indicator */}
            {showDetails && (
                <div className={styles.progressBar}>
                    <div className={styles.progressIndicator}>
                        Property {currentPropertyIndex + 1} of{" "}
                        {propertiesWithImages.length}
                    </div>
                    <div
                        className={styles.progressFill}
                        style={{
                            width: `${((currentPropertyIndex + 1) / propertiesWithImages.length) * 100}%`,
                        }}
                    ></div>
                </div>
            )}

            {/* Image Dots Indicator */}
            {showDetails && currentImages.length > 1 && (
                <div className={styles.dotsContainer}>
                    {currentImages.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.dot} ${
                                index === currentImageIndex
                                    ? styles.activeDot
                                    : ""
                            }`}
                            onClick={() => {
                                setImageTransition(true);
                                setTimeout(() => {
                                    setCurrentImageIndex(index);
                                    setImageTransition(false);
                                }, 150);
                            }}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default PropertyGallery;
