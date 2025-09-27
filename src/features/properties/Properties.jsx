import styles from "../../styles/Listings.module.css";
import { useEffect } from "react";
import Pagination from "../../ui/Pagination";
import Spinner from "../../ui/Spinner";
import toast from "react-hot-toast";
import {
    bedroomString,
    formatNum,
    getDaysFromCurrentDate,
} from "../../utils/utils";
import { useNavigate } from "react-router-dom";

function Properties({ listingType, isLoading, data, totalSize, error }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    return (
        <>
            {isLoading ? (
                <Spinner type="fullPage" />
            ) : (
                <div className={styles.listings}>
                    {data.map((item) => (
                        <div
                            onClick={() =>
                                navigate(
                                    `/for-${listingType.toLowerCase()}/list/${item.propertyId}`
                                )
                            }
                            className={styles.listingItem}
                            key={item.id}
                        >
                            <div className="imgContainer">
                                <img src={item.photos[0]} alt={item.title} />
                            </div>

                            <div className={styles.listingContent}>
                                <div className={styles.listingTop}>
                                    <h2>{item.title}</h2>
                                    <span>
                                        {`${getDaysFromCurrentDate(item.createTime)} days ago`}
                                    </span>
                                </div>
                                <span className={styles.listingType}>
                                    {item.propertyType.join(" ")}
                                </span>
                                <p className={styles.price}>
                                    <span>{formatNum(item.price)}</span>
                                    {listingType === "RENT" ? (
                                        <span>
                                            AED/
                                            {item.rentParam?.priceType ||
                                                "Year"}
                                        </span>
                                    ) : (
                                        <span>AED</span>
                                    )}
                                </p>
                                <ul>
                                    <li>
                                        <span>Community</span>
                                        <span>{item.community || "N/A"}</span>
                                    </li>
                                    <li>
                                        <span>Area</span>
                                        <span>{item.region || "N/A"}</span>
                                    </li>
                                    <li>
                                        <span>Developer</span>
                                        <span>{item.developer || "N/A"}</span>
                                    </li>
                                    <li>
                                        <span>Size</span>
                                        <span>{item.size || "N/A"} sq.ft</span>
                                    </li>
                                    <li className={styles.columnSpanTwo}>
                                        <span>Total Floors</span>
                                        <span>
                                            {item.rentParam?.totalFloor ||
                                                item.sellParam?.totalFloor ||
                                                "N/A"}
                                        </span>
                                    </li>
                                    <li className={styles.columnSpanTwo}>
                                        <span>Floor Level</span>
                                        <span>
                                            {item.rentParam?.floor || "N/A"}
                                        </span>
                                    </li>
                                    <li className={styles.columnSpanTwo}>
                                        <span>Bedrooms</span>
                                        <span>
                                            {bedroomString(item.bedRooms)}
                                        </span>
                                    </li>
                                    <li className={styles.columnSpanTwo}>
                                        <span>Bathrooms</span>
                                        <span>
                                            {item.rentParam?.bathrooms ||
                                                item.sellParam?.bathrooms ||
                                                "N/A"}
                                        </span>
                                    </li>
                                    <li>
                                        <span>Agent</span>
                                        <span>
                                            {item?.agent?.name || "N/A"}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <Pagination totalSize={totalSize} isLoading={isLoading} />
        </>
    );
}

export default Properties;
