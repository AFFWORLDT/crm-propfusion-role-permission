import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
    ChevronLeft, ChevronRight, Play, Pause, MapPin, BedDouble, Bath, Ruler, 
    Building2, Star, Heart, Share2, Home, DollarSign, Calendar, Users, 
    TrendingUp, Phone, ExternalLink, Eye, Clock, User, Building, Bed, FileText
} from 'lucide-react';
import styles from './PropertyGallerySlideshow.module.css';

const PropertyGallerySlideshow = ({ 
    properties = [], 
    autoPlay = true, 
    interval = 5000,
    showInfiniteScroll = true,
    itemsPerPage = 10
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeReel, setActiveReel] = useState('all');
    const [displayedProperties, setDisplayedProperties] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    
    const slideshowRef = useRef(null);
    const intervalRef = useRef(null);
    const imageIntervalRef = useRef(null);
    const observerRef = useRef(null);

    // Memoized property filtering for better performance
    const { rentProperties, sellProperties, allProperties } = useMemo(() => ({
        rentProperties: properties.filter(p => p.listingType === 'RENT'),
        sellProperties: properties.filter(p => p.listingType === 'SELL'),
        allProperties: properties
    }), [properties]);

    const getCurrentProperties = useCallback(() => {
        switch (activeReel) {
            case 'rent': return rentProperties;
            case 'sell': return sellProperties;
            default: return allProperties;
        }
    }, [activeReel, rentProperties, sellProperties, allProperties]);

    const currentProperties = getCurrentProperties();

    // Initialize displayed properties
    useEffect(() => {
        const initialProperties = currentProperties.slice(0, itemsPerPage);
        setDisplayedProperties(initialProperties);
        setCurrentPage(1);
        setHasMore(currentProperties.length > itemsPerPage);
        setCurrentIndex(0);
        setCurrentImageIndex(0);
    }, [currentProperties, itemsPerPage]);

    // Auto-scroll functionality with better performance
    useEffect(() => {
        if (isPlaying && displayedProperties.length > 0) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prevIndex) => {
                    const nextIndex = (prevIndex + 1) % displayedProperties.length;
                    // Load more properties if we're near the end
                    if (showInfiniteScroll && nextIndex >= displayedProperties.length - 3 && hasMore) {
                        loadMoreProperties();
                    }
                    return nextIndex;
                });
                setCurrentImageIndex(0);
            }, interval);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying, displayedProperties.length, interval, hasMore, showInfiniteScroll]);

    // Auto-scroll through images within a property
    useEffect(() => {
        if (isPlaying && displayedProperties[currentIndex]?.photos?.length > 1) {
            imageIntervalRef.current = setInterval(() => {
                setCurrentImageIndex((prev) => 
                    (prev + 1) % displayedProperties[currentIndex].photos.length
                );
            }, 3000);

            return () => {
                if (imageIntervalRef.current) {
                    if (imageIntervalRef.current) {
                        clearInterval(imageIntervalRef.current);
                    }
                }
            };
        }
    }, [isPlaying, currentIndex, displayedProperties]);

    // Load more properties for infinite scroll
    const loadMoreProperties = useCallback(async () => {
        if (isLoadingMore || !hasMore) return;
        
        setIsLoadingMore(true);
        
        // Simulate loading delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const nextPage = currentPage + 1;
        const startIndex = (nextPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const newProperties = currentProperties.slice(startIndex, endIndex);
        
        if (newProperties.length > 0) {
            setDisplayedProperties(prev => [...prev, ...newProperties]);
            setCurrentPage(nextPage);
            setHasMore(endIndex < currentProperties.length);
        } else {
            setHasMore(false);
        }
        
        setIsLoadingMore(false);
    }, [currentPage, itemsPerPage, currentProperties, isLoadingMore, hasMore]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        if (!showInfiniteScroll) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && hasMore && !isLoadingMore) {
                        loadMoreProperties();
                    }
                });
            },
            { threshold: 0.1 }
        );

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [showInfiniteScroll, hasMore, isLoadingMore, loadMoreProperties]);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % displayedProperties.length);
        setCurrentImageIndex(0);
    }, [displayedProperties.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? displayedProperties.length - 1 : prevIndex - 1
        );
        setCurrentImageIndex(0);
    }, [displayedProperties.length]);

    const goToSlide = useCallback((index) => {
        setCurrentIndex(index);
        setCurrentImageIndex(0);
    }, []);

    const togglePlayPause = useCallback(() => {
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    const handleReelChange = useCallback((reelType) => {
        setActiveReel(reelType);
        setCurrentIndex(0);
        setCurrentImageIndex(0);
        setCurrentPage(1);
        setHasMore(true);
    }, []);

    const handleImageChange = useCallback((direction, property) => {
        const currentIdx = currentImageIndex;
        const photosLength = property.photos?.length || 0;
        
        if (photosLength <= 1) return;
        
        let newIndex = currentIdx;
        if (direction === 'next' && currentIdx < photosLength - 1) {
            newIndex = currentIdx + 1;
        } else if (direction === 'prev' && currentIdx > 0) {
            newIndex = currentIdx - 1;
        }
        
        if (newIndex !== currentIdx) {
            setCurrentImageIndex(newIndex);
        }
    }, [currentImageIndex]);

    const handleShare = useCallback(async (property) => {
        try {
            const shareData = {
                title: property.title || 'Property',
                text: `Check out this amazing property: ${property.title}`,
                url: window.location.href
            };
            
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback for browsers that don't support Web Share API
                await navigator.clipboard.writeText(shareData.text);
                // You could show a toast notification here
            }
        } catch (error) {
            console.error('Error sharing property:', error);
        }
    }, []);

    const currentProperty = displayedProperties[currentIndex];
    const currentImage = currentProperty?.photos?.[currentImageIndex];

    if (!properties.length) {
        return (
            <div className={styles.noProperties}>
                <Star size={48} />
                <h3>No Properties Available</h3>
                <p>Add some properties to start the slideshow</p>
            </div>
        );
    }

    return (
        <div className={styles.galleryContainer}>
            {/* Header Section */}
            <div className={styles.headerSection}>
                <div className={styles.companyInfo}>
                    <div className={styles.logoContainer}>
                        <Building2 size={24} />
                        PROPERTY SHOWCASE
                    </div>
                    <div className={styles.liveIndicator}>
                        <div className={styles.liveDot}></div>
                        LIVE
                    </div>
                </div>

                <div className={styles.reelSelector}>
                    <button 
                        className={`${styles.reelBtn} ${activeReel === 'all' ? styles.active : ''}`}
                        onClick={() => handleReelChange('all')}
                    >
                        <Home size={16} />
                        ALL PROPERTIES
                        <span className={styles.propertyCount}>{allProperties.length}</span>
                    </button>
                    <button 
                        className={`${styles.reelBtn} ${activeReel === 'rent' ? styles.active : ''}`}
                        onClick={() => handleReelChange('rent')}
                    >
                        <Calendar size={16} />
                        RENT REEL
                        <span className={styles.propertyCount}>{rentProperties.length}</span>
                    </button>
                    <button 
                        className={`${styles.reelBtn} ${activeReel === 'sell' ? styles.active : ''}`}
                        onClick={() => handleReelChange('sell')}
                    >
                        <DollarSign size={16} />
                        SELL REEL
                        <span className={styles.propertyCount}>{sellProperties.length}</span>
                    </button>
                </div>

                <div className={styles.headerActions}>
                    <button className={styles.playPauseBtn} onClick={togglePlayPause}>
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                    <div className={styles.slideCounter}>
                        {currentIndex + 1}/{displayedProperties.length}
                    </div>
                </div>
            </div>

            {/* Main Slideshow */}
            <div className={styles.slideshow} ref={slideshowRef}>
                {/* Property Image with Enhanced Controls */}
                <div className={styles.imageContainer}>
                    {currentImage ? (
                        <img 
                            src={currentImage} 
                            alt={`${currentProperty?.title || 'Property'} - Image ${currentImageIndex + 1}`}
                            className={styles.propertyImage}
                        />
                    ) : (
                        <div className={styles.placeholderImage}>
                            <Building2 size={64} />
                            <p>No Image Available</p>
                        </div>
                    )}
                    
                    {/* Enhanced Image Navigation */}
                    {currentProperty?.photos?.length > 1 && (
                        <>
                            <div className={styles.imageDots}>
                                {currentProperty.photos.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`${styles.imageDot} ${index === currentImageIndex ? styles.active : ''}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    />
                                ))}
                            </div>
                            
                            <button 
                                className={`${styles.imageNavBtn} ${styles.imagePrevBtn}`}
                                onClick={() => handleImageChange('prev', currentProperty)}
                                disabled={currentImageIndex === 0}
                            >
                                <ChevronLeft size={24} />
                            </button>
                            
                            <button 
                                className={`${styles.imageNavBtn} ${styles.imageNextBtn}`}
                                onClick={() => handleImageChange('next', currentProperty)}
                                disabled={currentImageIndex === currentProperty.photos.length - 1}
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}

                    {/* Property Type Badge */}
                    <div className={styles.propertyTypeBadge}>
                        <span className={styles.typeText}>
                            {currentProperty?.listingType === 'RENT' ? 'FOR RENT' : 'FOR SALE'}
                        </span>
                    </div>

                    {/* Image Counter */}
                    {currentProperty?.photos?.length > 1 && (
                        <div className={styles.imageCounter}>
                            <span>{currentImageIndex + 1} / {currentProperty.photos.length}</span>
                        </div>
                    )}
                </div>

                {/* Enhanced Property Details Overlay */}
                <div className={styles.propertyDetails}>
                    <div className={styles.propertyHeader}>
                        <div className={styles.propertyType}>
                            <span className={styles.typeBadge}>
                                {currentProperty?.property_type || 'PROPERTY'}
                            </span>
                            <span className={styles.statusBadge}>
                                {currentProperty?.status || 'ACTIVE'}
                            </span>
                        </div>
                        <div className={styles.propertyActions}>
                            <button className={styles.actionBtn} onClick={() => handleShare(currentProperty)}>
                                <Share2 size={20} />
                            </button>
                            <button className={styles.actionBtn}>
                                <Heart size={20} />
                            </button>
                            <button className={styles.actionBtn}>
                                <Phone size={20} />
                            </button>
                        </div>
                    </div>

                    <h1 className={styles.propertyTitle}>
                        {currentProperty?.title || 'Untitled Property'}
                    </h1>

                    <div className={styles.propertyLocation}>
                        <MapPin size={18} />
                        {currentProperty?.location?.community && `${currentProperty.location.community}, `}
                        {currentProperty?.location?.city || 'Location not specified'}
                    </div>

                    <div className={styles.propertyPrice}>
                        <span className={styles.priceAmount}>
                            AED {(currentProperty?.price || 0).toLocaleString()}
                        </span>
                        {currentProperty?.listingType === 'RENT' && (
                            <span className={styles.pricePeriod}>/year</span>
                        )}
                    </div>

                    <div className={styles.propertySpecs}>
                        <div className={styles.specItem}>
                            <Bed size={16} />
                            {currentProperty?.bedRooms || 0} Beds
                        </div>
                        <div className={styles.specItem}>
                            <Bath size={16} />
                            {currentProperty?.bathrooms || 0} Baths
                        </div>
                        <div className={styles.specItem}>
                            <Ruler size={16} />
                            {currentProperty?.size || 0} sq.ft
                        </div>
                        <div className={styles.specItem}>
                            <FileText size={16} />
                            {currentProperty?.completionStatus || 'completed'}
                        </div>
                    </div>

                    {currentProperty?.description && (
                        <p className={styles.propertyDescription}>
                            {currentProperty.description}
                        </p>
                    )}

                    {currentProperty?.amenities && currentProperty.amenities.length > 0 && (
                        <div className={styles.amenities}>
                            <h4>Key Features</h4>
                            <div className={styles.amenityTags}>
                                {currentProperty.amenities.slice(0, 6).map((amenity, index) => (
                                    <span key={index} className={styles.amenityTag}>
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Enhanced Navigation Arrows */}
                <button className={`${styles.navArrow} ${styles.prevArrow}`} onClick={prevSlide}>
                    <ChevronLeft size={32} />
                </button>
                <button className={`${styles.navArrow} ${styles.nextArrow}`} onClick={nextSlide}>
                    <ChevronRight size={32} />
                </button>
            </div>

            {/* Thumbnail Navigation */}
            <div className={styles.thumbnailNav}>
                <div className={styles.thumbnailHeader}>
                    <h3>{activeReel === 'all' ? 'All Properties' : activeReel === 'rent' ? 'Rent Properties' : 'Sell Properties'}</h3>
                    <span>{displayedProperties.length} of {currentProperties.length} Properties</span>
                </div>
                <div className={styles.thumbnailContainer}>
                    {displayedProperties.map((property, index) => {
                        const isActive = currentIndex === index;
                        const hasImages = property.photos && property.photos.length > 0;
                        
                        return (
                            <div
                                key={property.id || property.propertyId || index}
                                className={`${styles.thumbnail} ${isActive ? styles.active : ''}`}
                                onClick={() => goToSlide(index)}
                            >
                                {hasImages ? (
                                    <img
                                        src={property.photos[0]}
                                        alt={property.title || 'Property'}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : (
                                    <div className={styles.noImagePlaceholder}>
                                        <span className={styles.noImageText}>No Image</span>
                                    </div>
                                )}
                                <div className={styles.thumbnailInfo}>
                                    <span className={styles.thumbnailTitle}>
                                        {property.title || 'Untitled Property'}
                                    </span>
                                    <span className={styles.thumbnailPrice}>
                                        AED {(property.price || 0).toLocaleString()}
                                    </span>
                                    <span className={styles.thumbnailType}>
                                        {property.listingType || 'SALE'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    
                    {/* Loading more thumbnails */}
                    {isLoadingMore && (
                        <div className={styles.loadingThumbnail}>
                            <div className={styles.loadingSpinner}></div>
                        </div>
                    )}
                    
                    {/* Show more properties button if there are more to load */}
                    {hasMore && !isLoadingMore && (
                        <button 
                            className={styles.loadMoreBtn}
                            onClick={loadMoreProperties}
                        >
                            Load More Properties
                        </button>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div className={styles.progressBar}>
                <div 
                    className={styles.progressFill} 
                    style={{ width: `${((currentIndex + 1) / displayedProperties.length) * 100}%` }}
                />
            </div>
        </div>
    );
};

export default PropertyGallerySlideshow;
