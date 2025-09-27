import styles from "../../../styles/ListingItem.module.css";
import { useEffect } from "react";
import useProperty from "../../../features/properties/useProperty";
import toast from "react-hot-toast";
import Spinner from "../../../ui/Spinner";
import PageNotFound from "../../PageNotFound";
import PropertyTop from "../../../features/properties/PropertyTop";
import SectionTop from "../../../ui/SectionTop";
import { bedroomString } from "../../../utils/utils";

function SellProperty() {
    const { data, isLoading, error } = useProperty();

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    if (isLoading) return <Spinner type="fullPage" />;
    if (data.length === 0) return <PageNotFound />;

    return (
        <div className="sectionContainer">
            <SectionTop heading="Sell Detail" /> 

            <section className="sectionStyles">
                <div className={styles.listingItem}>
                    <PropertyTop data={data[0]} />   

                    <div className={`sectionDiv ${styles.details}`}>
                        <h3>
                            <img src="/icons/grid.svg" alt="" />
                            <span>Details</span>
                        </h3>
                        <ul>
                            <li>
                                <span>ID: </span>
                                <span>{data[0].propertyId}</span>
                            </li>
                            <li>
                                <span>Completion status: </span>
                                <span>
                                    {data[0].sellParam.completionStatus ||
                                        "N/A"}
                                </span>
                            </li>
                            <li>
                                <span>Size: </span>
                                <span>{data[0].size || "N/A"} sq.ft</span>
                            </li>
                            <li>
                                <span>Bedrooms: </span>
                                <span>{bedroomString(data[0].bedRooms)}</span>
                            </li>
                            <li>
                                <span>Bathrooms: </span>
                                <span>
                                    {data[0].sellParam.bathrooms || "N/A"}
                                </span>
                            </li>
                            <li>
                                <span>Total Floor: </span>
                                <span>
                                    {data[0].sellParam.totalFloor || "N/A"}
                                </span>
                            </li>
                            <li>
                                <span>Year Built: </span>
                                <span>
                                    {data[0].sellParam.buildYear || "N/A"}
                                </span>
                            </li>
                            <li>
                                <span>Occupancy: </span>
                                <span>
                                    {data[0].sellParam.occupancy || "N/A"}
                                </span>
                            </li>
                            <li>
                                <span>Parking: </span>
                                <span>
                                    {data[0].sellParam.parking || "N/A"}
                                </span>
                            </li>
                            <li>
                                <span>Furniture: </span>
                                <span>{data[0].isFurniture || "N/A"}</span>
                            </li>
                            <li>
                                <span>Service Charge: </span>
                                <span>
                                    {data[0].sellParam.serviceCharge || "N/A"}
                                </span>
                            </li>
                            <li>
                                <span>AC Charge: </span>
                                <span>
                                    {data[0].sellParam.acCharge || "N/A"}
                                </span>
                            </li>
                            <li>
                                <span>Mortgage: </span>
                                <span>
                                    {data[0].sellParam.hasMortgage || "N/A"}
                                </span>
                            </li>
                            <li>
                                <span>Permit Number: </span>
                                <span>{data[0].permitNumber || "N/A"}</span>
                            </li>
                        </ul>
                    </div>

                    <div className={`sectionDiv ${styles.description}`}>
                        <h3>
                            <img src="/icons/document.svg" alt="" />
                            <span>Description</span>
                        </h3>
                        <p>{data[0].description}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default SellProperty;
