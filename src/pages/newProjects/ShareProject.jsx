import { useSearchParams } from "react-router-dom";
import useProject from "../../features/newProjects/useProject";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import PageNotFound from "../PageNotFound";
import BtnCreatePdf from "../../ui/BtnCreatePdf";
import styles from "../../styles/ShareListing.module.css";
import { bedroomString, dateToYMD, formatNum } from "../../utils/utils";
import useCompanySettings from "../../features/admin/general/useCompanySettings";
import { AMENITIES_OPTIONS } from "../../utils/constants";
import PropertyLightboxGallery from "../../features/properties/PropertyLightboxGallery";

// Currency names and symbols mapping
const currencyMap = {
    AED: { name: 'UAE Dirham', symbol: 'AED' },
    USD: { name: 'US Dollar', symbol: '$' },
    EUR: { name: 'Euro', symbol: '€' },
    GBP: { name: 'British Pound', symbol: '£' },
    INR: { name: 'Indian Rupee', symbol: '₹' },
    PKR: { name: 'Pakistani Rupee', symbol: 'Rs' },
    SAR: { name: 'Saudi Riyal', symbol: 'SAR' },
    CAD: { name: 'Canadian Dollar', symbol: 'CA$' },
    AUD: { name: 'Australian Dollar', symbol: 'A$' },
    JPY: { name: 'Japanese Yen', symbol: '¥' },
    CNY: { name: 'Chinese Yuan', symbol: '¥' },
    RUB: { name: 'Russian Ruble', symbol: '₽' },
    CHF: { name: 'Swiss Franc', symbol: 'CHF' },
    SGD: { name: 'Singapore Dollar', symbol: 'S$' },
    QAR: { name: 'Qatari Riyal', symbol: 'QAR' },
    KWD: { name: 'Kuwaiti Dinar', symbol: 'KWD' },
    BHD: { name: 'Bahraini Dinar', symbol: 'BHD' },
    OMR: { name: 'Omani Rial', symbol: 'OMR' }
};

const ID = "shareProjectDetails";

function ShareProject() {
    const [searchParams] = useSearchParams();
    const isPdf = searchParams.get("pdf") ? true : false;
    const currency = searchParams.get("currency") || "AED";
    const rate = parseFloat(searchParams.get("rate")) || 1;
    const { data } = useCompanySettings();

    const {
        data: projectData,
        isLoading: isLoadingProject,
        error: errorProject,
    } = useProject();
  
    useEffect(() => {
        if (errorProject) toast.error(errorProject.message);
    }, [errorProject]);

    const currencyInfo = useMemo(() => {
        return currencyMap[currency] || { name: currency, symbol: currency };
    }, [currency]);

    const convertPrice = (price) => {
        if (!price) return 0;
        return price * rate;
    };

    if (isLoadingProject)
        return <Spinner type="fullPage" />;
    if (projectData.length === 0) return <PageNotFound />;

    const amenitiesDisplay = AMENITIES_OPTIONS
        .filter((obj) => projectData[0].newParam.amenities?.includes(obj.code))
        .map((obj) => {
            return {
                label: obj.label,
                value: obj.code,
            };
        });

    // Helper function to get payment plan items
    const getPaymentPlanItems = (plan) => {
        const items = [];
        if (plan.first_installment) {
            items.push({
                key: "first_installment",
                label: "First Installment",
                value: plan.first_installment,
                count: plan.first_installment_count
            });
        }
        if (plan.under_construction) {
            items.push({
                key: "under_construction",
                label: "Under Construction",
                value: plan.under_construction,
                count: plan.under_construction_count
            });
        }
        if (plan.on_handover) {
            items.push({
                key: "on_handover",
                label: "On Handover",
                value: plan.on_handover,
                count: plan.on_handover_count
            });
        }
        if (plan.post_handover) {
            items.push({
                key: "post_handover",
                label: "Post Handover",
                value: plan.post_handover,
                count: plan.post_handover_count
            });
        }
        return items;
    };

    return (
        <section id={ID} className={styles.shareListing}>
            {isPdf && (
                <BtnCreatePdf
                    id={ID}
                    fileName={
                        projectData[0]?.name
                            ? `${projectData[0].name.replace(/\s+/g, '_')}_Project.pdf`
                            : 'Project.pdf'
                    }
                />
            )}

            <div className={styles.shareListingBg}></div>

            <div className={styles.shareListingContent}>
                <div className={styles.listingHeader}>
                    <div className={styles.logo}>
                        <img src={data?.company_logo_url} />
                        <h2>{data?.company_name}</h2>
                    </div>
                    {projectData[0]?.agent && (
                        <div className={styles.userDetails}>
                            <img src={projectData[0]?.agent?.avatar} />
                            <div className={styles.userDetailsContent}>
                                <h2>{projectData[0]?.agent?.name}</h2>
                                <div>
                                    <img src="/share-page/call.png" />
                                    <span>{projectData[0]?.agent?.phone}</span>
                                </div>
                                <div>
                                    <img src="/share-page/mail.png" />
                                    <span>{projectData[0]?.agent?.email}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.listingHero}>
                    <div className={styles.imagesGrid}>
                        {projectData[0].photos?.slice(0, 5).map((photo, index) => (
                            <div key={index} className="imgContainer">
                                <img src={photo} alt={`Project image ${index + 1}`} />
                            </div>
                        ))}
                    </div>

                    <div className={styles.listingHeroContent}>
                        <h1>{projectData[0].name}</h1>
                        <span>{projectData[0].propertyTypes.join(" | ")}</span>
                        <p className={styles.price}>
                            <span>
                                {currencyInfo.symbol} {formatNum(convertPrice(projectData[0].newParam.price))}
                            </span>
                            <span>{currency} Starting</span>
                        </p>
                        {currency !== "AED" && (
                            <p className={styles.originalPrice} style={{ fontSize: '0.85rem', color: '#666' }}>
                                (AED {formatNum(projectData[0].newParam.price)})
                            </p>
                        )}
                        <ul>
                            <li>
                                <div>
                                    <img src="/share-page/developer.png" />
                                    <span>Developer</span>
                                </div>
                                <span>{projectData[0].developer?.name}</span>
                            </li>
                            <li>
                                <div>
                                    <img src="/share-page/community.png" />
                                    <span>Community</span>
                                </div>
                                <span>{projectData[0].location?.community || "N/A"}</span>
                            </li>
                            <li>
                                <div>
                                    <img src="/share-page/community.png" />
                                    <span>Sub Community</span>
                                </div>
                                <span>{projectData[0].location?.sub_community || "N/A"}</span>
                            </li>
                            <li>
                                <div>
                                    <img src="/share-page/calendar.png" />
                                    <span>Handover Date</span>
                                </div>
                                <span>
                                    {dateToYMD(
                                        projectData[0].newParam.handoverTime
                                    )}
                                </span>
                            </li>
                            <li>
                                <div>
                                    <img src="/share-page/size.png" />
                                    <span>Size</span>
                                </div>
                                <span>
                                    {`${projectData[0].newParam.size_min || "N/A"} - ${projectData[0].newParam.size_max || "N/A"} sq.ft`}
                                </span>
                            </li>
                            <li>
                                <div>
                                    <img src="/share-page/bedroom.png" />
                                    <span>Bedrooms</span>
                                </div>
                                <span>
                                    {`${bedroomString(projectData[0].newParam.bedroomMin)} - ${bedroomString(projectData[0].newParam.bedroomMax)}`}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={styles.listingInfo}>
                    <ul>
                        <li>
                            <span>
                                <img src="/share-page/call.png" alt="Service Charge" />
                                Service Charge: 
                            </span>
                            <span>
                                {projectData[0].newParam.propertyFee 
                                    ? `${currencyInfo.symbol} ${formatNum(convertPrice(projectData[0].newParam.propertyFee))}` 
                                    : "N/A"}
                            </span>
                        </li>
                        <li>
                            <span>
                                <img src="/share-page/size.png" alt="Total Floor" />
                                Total Floor: 
                            </span>
                            <span>
                                {projectData[0].newParam.totalFloor || "N/A"}
                            </span>
                        </li>
                        <li>
                            <span>
                                <img src="/share-page/community.png" alt="Total Units" />
                                Total Units: 
                            </span>
                            <span>
                                {projectData[0].newParam.totalUnits || "N/A"}
                            </span>
                        </li>
                        <li>
                            <span>
                                <img src="/share-page/calendar.png" alt="Listed On" />
                                Listed On: 
                            </span>
                            <span>
                                {dateToYMD(projectData[0].createTime) || "N/A"}
                            </span>
                        </li>
                    </ul>
                </div>

                <div className={styles.listingDescription}>
                    <h3>
                        <div></div>
                        <span>Description</span>
                    </h3>
                    <p>{projectData[0].description || ""}</p>
                </div>

                <div className={styles.listingPaymentPlan}>
                <h3>
                        <div></div>
                        <span>Payment Plans</span>
                    </h3>
                    {projectData[0]?.payment_plans?.map((plan) => (
                        <div key={plan?.id} className={styles.paymentPlanSection}>
                        
                         
                            <div className={styles.installmentSections}>
                                {plan?.first_installment && (
                                    <div className={styles.installmentSection}>
                                        <h5>First Installment</h5>
                                        <div className={styles.installmentDetails}>
                                            <div>
                                                <span>Percentage:</span>
                                                <span>{plan?.first_installment}%</span>
                                            </div>
                                            {plan?.first_installment_count && (
                                                <div>
                                                    <span>Installments:</span>
                                                    <span>{plan?.first_installment_count}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {plan?.under_construction && (
                                    <div className={styles.installmentSection}>
                                        <h5>Under Construction</h5>
                                        <div className={styles.installmentDetails}>
                                            <div>
                                                <span>Percentage:</span>
                                                <span>{plan?.under_construction}%</span>
                                            </div>
                                            {plan?.under_construction_count && (
                                                <div>
                                                    <span>Installments:</span>
                                                    <span>{plan?.under_construction_count}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {plan?.on_handover && (
                                    <div className={styles.installmentSection}>
                                        <h5>On Handover</h5>
                                        <div className={styles.installmentDetails}>
                                            <div>
                                                <span>Percentage:</span>
                                                <span>{plan?.on_handover}%</span>
                                            </div>
                                            {plan?.on_handover_count && (
                                                <div>
                                                    <span>Installments:</span>
                                                    <span>{plan?.on_handover_count}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {plan?.post_handover && (
                                    <div className={styles.installmentSection}>
                                        <h5>Post Handover</h5>
                                        <div className={styles.installmentDetails}>
                                            <div>
                                                <span>Percentage:</span>
                                                <span>{plan?.post_handover}%</span>
                                            </div>
                                            {plan?.post_handover_count && (
                                                <div>
                                                    <span>Installments:</span>
                                                    <span>{plan?.post_handover_count}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className={styles.totalSection}>
                                <h5>Total Payment</h5>
                                <div className={styles.totalAmount}>
                                    {((plan?.first_installment || 0) + 
                                      (plan?.under_construction || 0) + 
                                      (plan?.on_handover || 0) + 
                                      (plan?.post_handover || 0)).toFixed(1)}%
                                </div>
                            </div>
                        </div>
                    ))}
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

                <div className={styles.listingFloorPlan}>
                    <h3>
                        <div></div>
                        <span>Floor Plan</span>
                    </h3>
                    <div className={styles.floorPlanContainer}>
                        {projectData[0].floor_plans?.map((plan) => (
                            <div className={styles.floorPlanItem} key={plan.id}>
                                <div className="imgContainer">
                                    <img src={plan.layout} />
                                </div>
                                <div className={styles.floorPlanContent}>
                                    <span>{plan.title}</span>
                                    <span>{plan.size} sq.ft</span>
                                    {plan.price && (
                                        <span>
                                            {currencyInfo.symbol} {formatNum(convertPrice(plan.price))}
                                            {currency !== "AED" && (
                                                <span style={{ fontSize: '0.85rem', color: '#666', display: 'block' }}>
                                                    (AED {formatNum(plan.price)})
                                                </span>
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {projectData[0].photos?.length > 0 && (
                    <div className={styles.imageGallery}>
                        <h3>
                            <div></div>
                            <span>Project Gallery ({projectData[0].photos.length} Images)</span>
                        </h3>
                        <PropertyLightboxGallery images={projectData[0].photos} />
                    </div>
                )}
            </div>
        </section>
    );
}

export default ShareProject;
