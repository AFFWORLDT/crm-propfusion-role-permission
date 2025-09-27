import { useSearchParams } from "react-router-dom";
import styles from "./BulkSharePremium.module.css";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Spinner from "../../../ui/Spinner";
import PageNotFound from "../../PageNotFound";
import BtnCreatePdf from "../../../ui/BtnCreatePdf";
import { bedroomString, formatNum } from "../../../utils/utils";
import { getApiUrl } from "../../../utils/getApiUrl";
import {
    MapPin,
    BedDouble,
    Bath,
    Ruler,
    Building2,
    Calendar,
    Car,
    CheckCircle2,
    Wallet,
    Star,
    TrendingUp,
    Users,
    Home
} from "lucide-react";

const ID = "bulkSharePremium";

// Utility function to safely extract values from object data structures
const extractValue = (value) => {
    if (typeof value === 'object' && value !== null) {
        if (value.label !== undefined) return value.label;
        if (value.name !== undefined) return value.name;
        if (value.code !== undefined) return value.code;
        return JSON.stringify(value);
    }
    return value;
};

function BulkSharePremium() {
    const [searchParams] = useSearchParams();
    const propertyIds = searchParams.get("propertyIds");
    const userId = searchParams.get("userId");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [propertiesData, setPropertiesData] = useState([]);
    const [companyData, setCompanyData] = useState(null);

    useEffect(() => {
        async function fetchProperties() {
            try {
                if (!propertyIds) {
                    throw new Error("No properties selected");
                }

                const ids = propertyIds.split(',');
                console.log('Selected property IDs:', ids);
                
                try {
                    // First try to use the bulk API with specific property IDs
                    const response = await fetch(
                        `${getApiUrl()}/properties/get_properties_for_sharing?property_ids=${ids.join(',')}&limit=${ids.length}&exact_match=true`
                    );
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log('API Response:', data);
                        
                        if (data.properties && data.properties.length > 0) {
                            // Filter to only include the specifically selected properties
                            const selectedProperties = data.properties.filter(prop => {
                                const propId = prop.id?.toString();
                                const propPropertyId = prop.propertyId;
                                const isSelected = ids.some(id => 
                                    id === propId || id === propPropertyId || id === propId?.toString()
                                );
                                console.log(`Property ${prop.id}: propId=${propId}, propPropertyId=${propPropertyId}, isSelected=${isSelected}`);
                                return isSelected;
                            });
                            
                            console.log('Filtered properties:', selectedProperties);
                            console.log('Expected IDs:', ids);
                            console.log('All API properties:', data.properties.map(p => ({ id: p.id, propertyId: p.propertyId })));
                            
                            if (selectedProperties.length > 0) {
                                // Verify we have the correct number of properties
                                if (selectedProperties.length !== ids.length) {
                                    console.warn(`Expected ${ids.length} properties but got ${selectedProperties.length}`);
                                    console.warn('Missing properties. Checking individual fetching...');
                                    // If filtering failed, fall back to individual fetching
                                    throw new Error('Filtering failed, using individual fetching');
                                }
                                
                                setPropertiesData(selectedProperties);
                                setCompanyData({
                                    company_name: data.company_name || "Property Company",
                                    company_logo_url: data.company_logo_url || "/icons/company-logo.png"
                                });
                                setIsLoading(false);
                                return;
                            }
                        }
                    }
                } catch (bulkError) {
                    console.log('Bulk API failed, falling back to individual calls:', bulkError);
                }
                
                // Fallback to individual property fetching
                console.log('Using individual property fetching...');
                const promises = ids.map(async (id) => {
                    console.log(`Fetching individual property with ID: ${id}`);
                    const response = await fetch(
                        `${getApiUrl()}/properties/get_properties_for_sharing?property_id=${id}`
                    );
                    if (!response.ok) throw new Error(`Failed to fetch property ${id}`);
                    const data = await response.json();
                    console.log(`Property ${id} response:`, data);
                    return data.properties?.[0];
                });

                const properties = await Promise.all(promises);
                const validProperties = properties.filter(Boolean);
                
                console.log('Individual fetch results:', validProperties);
                console.log('Valid properties count:', validProperties.length);
                console.log('Expected count:', ids.length);
                
                if (validProperties.length === 0) {
                    throw new Error("No valid properties found");
                }

                if (validProperties.length !== ids.length) {
                    console.warn(`Individual fetching: Expected ${ids.length} properties but got ${validProperties.length}`);
                }

                setPropertiesData(validProperties);
                
                // Get company data from first property
                if (validProperties[0]) {
                    setCompanyData({
                        company_name: validProperties[0].company_name || "Property Company",
                        company_logo_url: validProperties[0].company_logo_url || "/icons/company-logo.png"
                    });
                }
                
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                toast.error(err.message);
                setIsLoading(false);
            }
        }

        fetchProperties();
    }, [propertyIds]);

    if (isLoading) return <Spinner type="fullPage" />;
    if (error || propertiesData.length === 0) return <PageNotFound />;

    return (
        <section id={ID} className={styles.bulkSharePremium}>
            <BtnCreatePdf
                id={ID}
                fileName={`Bulk_Properties_Comparison_${new Date().toISOString().split('T')[0]}.pdf`}
            />

            {/* Header */}
            <div className={styles.header}>
                <div className={styles.companyInfo}>
                    <img src={companyData?.company_logo_url} alt="Company Logo" />
                    <h1>{companyData?.company_name}</h1>
                </div>
                <div className={styles.bulkInfo}>
                    <h2>Property Comparison</h2>
                    <p>{propertiesData.length} Properties Selected</p>
                    <div className={styles.bulkBadge}>
                        <Star size={16} />
                        <span>Premium Comparison</span>
                    </div>
                </div>
            </div>

            {/* Properties Grid */}
            <div className={styles.propertiesGrid}>
                {propertiesData.map((property, index) => (
                    <div key={property.id || index} className={styles.propertyCard}>
                        {/* Property Header */}
                        <div className={styles.propertyHeader}>
                            <div className={styles.propertyImage}>
                                <img src={property.photos?.[0] || "/icons/property-placeholder.png"} alt="Property" />
                                <div className={styles.propertyStatus}>
                                    <span className={styles.statusBadge}>{property.status}</span>
                                    <span className={styles.propertyType}>{property.property_type}</span>
                                </div>
                            </div>
                            <div className={styles.propertyTitle}>
                                <h3>{property.title || `Property ${index + 1}`}</h3>
                                <div className={styles.price}>
                                    <span className={styles.priceAmount}>AED {formatNum(property.price || 0)}</span>
                                    {property.listingType === 'RENT' && property.priceType && (
                                        <span className={styles.pricePeriod}>/ {property.priceType}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Property Details */}
                        <div className={styles.propertyDetails}>
                            <div className={styles.detailRow}>
                                <MapPin size={16} />
                                <span>{[
                                    property.location?.property_name,
                                    property.location?.sub_community,
                                    property.location?.community,
                                    property.location?.city
                                ].filter(Boolean).join(', ')}</span>
                            </div>
                            
                            <div className={styles.detailsGrid}>
                                <div className={styles.detailItem}>
                                    <BedDouble size={16} />
                                    <span>{bedroomString(property.bedRooms || 0)}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <Bath size={16} />
                                    <span>{extractValue(property.bathrooms) || 'N/A'}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <Ruler size={16} />
                                    <span>{property.size || 'N/A'} sq.ft</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <Building2 size={16} />
                                    <span>{extractValue(property.completionStatus) || 'N/A'}</span>
                                </div>
                            </div>

                            {/* Additional Features */}
                            <div className={styles.featuresList}>
                                {property.amenities && property.amenities.length > 0 ? (
                                    property.amenities.slice(0, 3).map((amenity, idx) => (
                                        <span key={idx} className={styles.featureTag}>
                                            {extractValue(amenity)}
                                        </span>
                                    ))
                                ) : (
                                    <span className={styles.featureTag}>No amenities listed</span>
                                )}
                            </div>

                            {/* Property Map */}
                            {property.location?.latitude && property.location?.longitude && (
                                <div className={styles.propertyMap}>
                                    <div className={styles.mapContainer}>
                                        <iframe
                                            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${property.location.latitude},${property.location.longitude}&zoom=15`}
                                            width="100%"
                                            height="150"
                                            style={{ border: 0, borderRadius: '8px' }}
                                            allowFullScreen=""
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title={`${property.title} Location`}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Comparison Summary */}
            <div className={styles.comparisonSummary}>
                <h3>Comparison Summary</h3>
                <div className={styles.summaryGrid}>
                    <div className={styles.summaryCard}>
                        <TrendingUp size={24} />
                        <h4>Price Range</h4>
                        <p>
                            {(() => {
                                const prices = propertiesData.map(p => p.price || 0).filter(p => p > 0);
                                if (prices.length === 0) return 'Price not available';
                                const minPrice = Math.min(...prices);
                                const maxPrice = Math.max(...prices);
                                return minPrice === maxPrice 
                                    ? `AED ${formatNum(minPrice)}`
                                    : `AED ${formatNum(minPrice)} - AED ${formatNum(maxPrice)}`;
                            })()}
                        </p>
                    </div>
                    <div className={styles.summaryCard}>
                        <Home size={24} />
                        <h4>Property Types</h4>
                        <p>
                            {(() => {
                                const types = propertiesData.map(p => extractValue(p.property_type)).filter(Boolean);
                                const uniqueTypes = [...new Set(types)];
                                return uniqueTypes.length > 0 ? uniqueTypes.join(', ') : 'Not specified';
                            })()}
                        </p>
                    </div>
                    <div className={styles.summaryCard}>
                        <MapPin size={24} />
                        <h4>Locations</h4>
                        <p>
                            {(() => {
                                const cities = propertiesData.map(p => p.location?.city).filter(Boolean);
                                const uniqueCities = [...new Set(cities)];
                                return uniqueCities.length > 0 ? uniqueCities.join(', ') : 'Not specified';
                            })()}
                        </p>
                    </div>
                    <div className={styles.summaryCard}>
                        <Users size={24} />
                        <h4>Total Properties</h4>
                        <p>{propertiesData.length} Properties</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BulkSharePremium;
