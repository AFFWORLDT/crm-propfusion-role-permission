import { useSearchParams } from "react-router-dom";
import styles from "../../../styles/ShareListing.module.css";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Spinner from "../../../ui/Spinner";
import PageNotFound from "../../PageNotFound";
import BtnCreatePdf from "../../../ui/BtnCreatePdf";
import { bedroomString, formatNum } from "../../../utils/utils";
import useStaff from "../../../features/admin/staff/useStaff";
import useProperty from "../../../features/properties/useProperty";
import useCompanySettings from "../../../features/admin/general/useCompanySettings";
import { AMENITIES_OPTIONS } from "../../../utils/constants";

const ID = "sharePropertyDetails";

function ShareRentProperty() {
    const [searchParams] = useSearchParams();
    const isPdf = searchParams.get("pdf") ? true : false;
    const userId = searchParams.get("userId");
    const { data } = useCompanySettings();

    const {
        data: userData,
        isLoading: isLoadingUser,
        error: errorUser,
    } = useStaff(userId);
    const {
        data: propertyData,
        isLoading: isLoadingProperty,
        error: errorProperty,
    } = useProperty();
   

    useEffect(() => {
        if (errorUser) toast.error(errorUser.message);
    }, [errorUser]);

    useEffect(() => {
        if (errorProperty) toast.error(errorProperty.message);
    }, [errorProperty]);

    

    if (isLoadingProperty  || isLoadingUser)
        return <Spinner type="fullPage" />;
    if (propertyData.length === 0) return <PageNotFound />;

    const amenitiesDisplay = AMENITIES_OPTIONS
        .filter((obj) => propertyData[0].amenities?.includes(obj.label))
        .map((obj) => {
            return {
                label: obj.label,
                value: obj.code,
            };
        });

    return (
        <section id={ID} className={styles.shareListing}>
            {isPdf && <BtnCreatePdf id={ID} />}

            <div className={styles.shareListingBg}></div>

            <div className={styles.shareListingContent}>
                <div className={styles.listingHeader}>
                    <div className={styles.logo}>
                        <img src={data?.company_logo_url} />
                        <h2>{data?.company_name}</h2>
                    </div>
                    <div className={styles.userDetails}>
                        <img src={userData.avatar} />
                        <div className={styles.userDetailsContent}>
                            <h2>{userData.name}</h2>
                            <div>
                                <img src="/share-page/call.png" />
                                <span>{userData.phone}</span>
                            </div>
                            <div>
                                <img src="/share-page/mail.png" />
                                <span>{userData.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.listingHero}>
                    <div className={styles.imagesGrid}>
                        <div className="imgContainer">
                            <img src={propertyData[0].photos?.[0]} />
                        </div>
                        <div className="imgContainer">
                            <img src={propertyData[0].photos?.[1]} />
                        </div>
                        <div className="imgContainer">
                            <img src={propertyData[0].photos?.[2]} />
                        </div>
                        <div className="imgContainer">
                            <img src={propertyData[0].photos?.[3]} />
                        </div>
                        <div className="imgContainer">
                            <img src={propertyData[0].photos?.[4]} />
                        </div>
                    </div>

                    <div className={styles.listingHeroContent}>
                        <h1>{propertyData[0].title}</h1>
                        <span>{propertyData[0].propertyType.join(" | ")}</span>
                        <p className={styles.price}>
                            <span>{formatNum(propertyData[0].price)}</span>
                            <span>
                                AED / {propertyData[0].rentParam.priceType}
                            </span>
                        </p>
                        <ul>
                            <li>
                                <div>
                                    <img src="/share-page/developer.png" />
                                    <span>Developer</span>
                                </div>
                                <span>
                                    {propertyData[0].developer || "N/A"}
                                </span>
                            </li>
                            <li>
                                <div>
                                    <img src="/share-page/area.png" />
                                    <span>Area</span>
                                </div>
                                <span>{propertyData[0].region || "N/A"}</span>
                            </li>
                            <li>
                                <div>
                                    <img src="/share-page/community.png" />
                                    <span>Community</span>
                                </div>
                                <span>{propertyData[0].community}</span>
                            </li>
                            <li>
                                <div>
                                    <img src="/share-page/size.png" />
                                    <span>Size</span>
                                </div>
                                <span>{propertyData[0].size} sq.ft</span>
                            </li>
                            <li>
                                <div>
                                    <img src="/share-page/bedroom.png" />
                                    <span>Bedrooms</span>
                                </div>
                                <span>
                                    {bedroomString(propertyData[0].bedRooms)}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={styles.listingInfo}>
                    <ul>
                        <li>
                            <span>Bathrooms: </span>
                            <span>
                                {propertyData[0].rentParam.bathrooms || "N/A"}
                            </span>
                        </li>
                        <li>
                            <span>Total Floor: </span>
                            <span>
                                {propertyData[0].rentParam.totalFloor || "N/A"}
                            </span>
                        </li>
                        <li>
                            <span>Floor: </span>
                            <span>
                                {propertyData[0].rentParam.floor || "N/A"}
                            </span>
                        </li>
                        <li>
                            <span>Year Built: </span>
                            <span>
                                {propertyData[0].rentParam.buildYear || "N/A"}
                            </span>
                        </li>
                        <li>
                            <span>Occupancy: </span>
                            <span>
                                {propertyData[0].rentParam.occupancy || "N/A"}
                            </span>
                        </li>
                        <li>
                            <span>Parking: </span>
                            <span>
                                {propertyData[0].rentParam.parking || "N/A"}
                            </span>
                        </li>
                        <li>
                            <span>Furniture: </span>
                            <span>{propertyData[0].isFurnished || "N/A"}</span>
                        </li>
                        <li>
                            <span>Deposit: </span>
                            <span>
                                {`AED ${formatNum(propertyData[0].rentParam.deposit)}` ||
                                    "N/A"}
                            </span>
                        </li>
                        <li>
                            <span>Cheques: </span>
                            <span>
                                {propertyData[0].rentParam.cheques || "N/A"}
                            </span>
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
                            <div className={styles.amenity} key={item.value}>
                                <div>{item.value}</div>
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.listingDescription}>
                    <h3>
                        <div></div>
                        <span>Description</span>
                    </h3>
                    <p>{propertyData[0].description || ""}</p>
                </div>
            </div>
        </section>
    );
}

export default ShareRentProperty;
