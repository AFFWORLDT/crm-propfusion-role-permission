import { useSearchParams } from "react-router-dom";
import styles from "../../../styles/ShareListing.module.css";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Spinner from "../../../ui/Spinner";
import PageNotFound from "../../PageNotFound";
import BtnCreatePdf from "../../../ui/BtnCreatePdf";
import { bedroomString, formatNum } from "../../../utils/utils";
import { getApiUrl } from "../../../utils/getApiUrl";
import PropertyLightboxGallery from "../../../features/properties/PropertyLightboxGallery";

const ID = "sharePropertyDetails";

function ShareNewSellProperty() {
    const [searchParams] = useSearchParams();
    const isPdf = searchParams.get("pdf") ? true : false;
    const currency = searchParams.get("currency") || "AED";
    const rate = searchParams.get("rate") ? parseFloat(searchParams.get("rate")) : 1;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [propertyData, setPropertyData] = useState(null);

    useEffect(() => {
        async function fetchProperty() {
            try {
                const propertyId = window.location.pathname.split('/').pop();
                const response = await fetch(
                    `${getApiUrl()}/properties/get_properties_for_sharing?property_id=${propertyId}`
                );
                
                if (!response.ok) throw new Error("Failed to fetch property");
                
                const data = await response.json();
                setPropertyData(data);
                setIsLoading(false);
            } catch (err) {
                setError(err?.message);
                toast.error(err?.message);
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

    if (isLoading) return <Spinner type="fullPage" />;
    if (error || !propertyData?.properties?.[0]) return <PageNotFound />;

    const property = propertyData?.properties?.[0];
    const amenitiesDisplay = property?.amenities || [];

    return (
        <section id={ID} className={styles.shareListing}>
            {isPdf && (
                <BtnCreatePdf
                    id={ID}
                    fileName={
                        property?.title
                            ? `${property?.title?.replace(/\s+/g, '_')}_SELL.pdf`
                            : 'Property_Sell.pdf'
                    }
                />
            )}

            <div className={styles.shareListingBg}></div>

            <div className={styles.shareListingContent}>
                <div className={styles.listingHeader}>
                    <div className={styles.logo}>
                        <img src={propertyData?.company_logo_url} />
                        <h2>{propertyData?.company_name}</h2>
                    </div>
                    <div className={styles.userDetails}>
                        <img src={property?.agent?.avatar} />
                        <div className={styles.userDetailsContent}>
                            <h2>{property?.agent?.name}</h2>
                            <div>
                                <img src="/share-page/call.png" />
                                <span>{property?.agent?.phone}</span>
                            </div>
                            <div>
                                <img src="/share-page/mail.png" />
                                <span>{property?.agent?.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.listingHero}>
                    <div className={styles.imagesGrid}>
                        {property?.photos?.slice(0, 5).map((photo, index) => (
                            <div key={index} className="imgContainer">
                                <img src={photo} alt={`Property image ${index + 1}`} />
                            </div>
                        ))}
                    </div>

                    <div className={styles.listingHeroContent}>
                        <h1>{property?.title}</h1>
                        <span>{property?.property_type}</span>
                        <p className={styles.price}>
                            <span>{formatNum(convertPrice(property?.price))}</span>
                            <span>{currency}</span>
                        </p>
                        <ul>
                            <li>
                                <div>
                                    <img src="/share-page/developer.png" />
                                    <span>Developer</span>
                                </div>
                                <span>{property?.developer?.name || 'N/A'}</span>
                            </li>
                            <li>
                                <div>
                                    <img src="/share-page/area.png" />
                                    <span>Area</span>
                                </div>
                                <span>{property?.area?.name}</span>
                            </li>
                            <li>
                                <div>
                                    <img src="/share-page/community.png" />
                                    <span>Location</span>
                                </div>
                                <span>
                                    {[
                                        property?.location?.property_name,
                                        property?.location?.sub_community, 
                                        property?.location?.community,
                                        property?.location?.city
                                    ]
                                        .filter(Boolean)
                                        .map((field, index, array) =>
                                            index < array.length - 1
                                                ? `${field}, `
                                                : field
                                        )}
                                </span>
                            </li>
                            <li>
                                <div>
                                    <img src="/share-page/size.png" />
                                    <span>Size</span>
                                </div>
                                <span>{property?.size} sq.ft</span>
                            </li>
                            <li>
                                <div>
                                    <img src="/share-page/bedroom.png" />
                                    <span>Bedrooms</span>
                                </div>
                                <span>{bedroomString(property?.bedRooms)}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={styles.listingInfo}>
                    <ul>
                        <li>
                            <span>
                                <img src="/share-page/bedroom.png" alt="Bathrooms" />
                                Bathrooms: 
                            </span>
                            <span>{property?.bathrooms || "N/A"}</span>
                        </li>
                        <li>
                            <span>
                                <img src="/share-page/size.png" alt="Total Floor" />
                                Total Floor: 
                            </span>
                            <span>{property?.totalFloor || "N/A"}</span>
                        </li>
                        <li>
                            <span>
                                <img src="/share-page/size.png" alt="Floor" />
                                Floor: 
                            </span>
                            <span>{property?.floor || "N/A"}</span>
                        </li>
                        <li>
                            <span>
                                <img src="/share-page/calendar.png" alt="Year Built" />
                                Year Built: 
                            </span>
                            <span>{property?.buildYear || "N/A"}</span>
                        </li>
                        <li>
                            <span>
                                <img src="/share-page/community.png" alt="Occupancy" />
                                Occupancy: 
                            </span>
                            <span>{property?.occupancy || "N/A"}</span>
                        </li>
                        <li>
                            <span>
                                <img src="/share-page/area.png" alt="Parking" />
                                Parking: 
                            </span>
                            <span>{property?.parking || "N/A"}</span>
                        </li>
                        <li>
                            <span>
                                <img src="/share-page/community.png" alt="Furniture" />
                                Furniture: 
                            </span>
                            <span>{property?.isFurnished || "N/A"}</span>
                        </li>
                        <li>
                            <span>
                                <img src="/share-page/call.png" alt="Service Charge" />
                                Service Charge: 
                            </span>
                            <span>
                                {property?.serviceCharge ? `${currency} ${formatNum(convertPrice(property?.serviceCharge))}` : "N/A"}
                            </span>
                        </li>
                        <li>
                            <span>
                                <img src="/share-page/calendar.png" alt="Completion Status" />
                                Completion Status: 
                            </span>
                            <span>{property?.completionStatus || "N/A"}</span>
                        </li>
                    </ul>
                </div>

                <div className={styles.listingAmenities}>
                    <h3>
                        <div></div>
                        <span>Amenities</span>
                    </h3>
                    <div className={styles.amenitiesContainer}>
                        {amenitiesDisplay.map((item) => (
                            <div className={styles.amenity} key={item?.code}>
                                <div>{item?.code}</div>
                                <span>{item?.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.listingDescription}>
                    <h3>
                        <div></div>
                        <span>Description</span>
                    </h3>
                    <p>{property?.description || ""}</p>
                </div>

                {property?.photos?.length > 0 && (
                    <div className={styles.imageGallery}>
                        <h3>
                            <div></div>
                            <span>Property Gallery ({property.photos.length} Images)</span>
                        </h3>
                        <PropertyLightboxGallery images={property.photos} />
                    </div>
                )}
            </div>
        </section>
    );
}

export default ShareNewSellProperty;
