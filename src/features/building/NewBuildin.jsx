import styles from "../../styles/Listings.module.css";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Spinner from "../../ui/Spinner";
import { getDaysFromCurrentDate } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
function NewBuilding({ isLoading, data, error, isFetchingNextPage }) {
    const navigate = useNavigate();
    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    const navigateToDetails = (id) => {
        navigate(`/new-building/list/${id}`);
    };

    return (
        <div style={{ position: "relative", height: "100%" }}>
            {isLoading ? (
                <div>
                    <Spinner type="fullPage" />
                </div>
            ) : (
                <>
                    <div className={styles.listings}>
                        {data.map((item) => (
                            <div
                                className={styles.listingItem}
                                key={item.id}
                                onClick={() => {
                                    navigateToDetails(item.id);
                                }}
                            >
                                <div className="imgContainer">
                                    <img
                                        src={item?.photos?.[0]}
                                        alt={item?.name}
                                    />
                                </div>

                                <div className={styles.listingContent}>
                                    <div className={styles.listingTop}>
                                        <h2>{item?.name}</h2>
                                        <div>
                                            <span>
                                                {`${getDaysFromCurrentDate(item?.created_at)} days ago`}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={styles.listingType}>
                                        {item?.propertyTypes?.join(" ")}
                                    </span>
                                    <p className={styles.price}>
                                        <span>
                                            {item.building_name}{" "}
                                            {/* {formatNum(item?.newParam?.price)} */}
                                        </span>
                                        {/* <span>AED Starting</span> */}
                                    </p>
                                    <ul>
                                        <li>
                                            <span>Owner</span>
                                            <span>
                                                {item?.owner?.owner_name ||
                                                    "N/A"}
                                            </span>
                                        </li>
                                        <li>
                                            <span>Total Units</span>
                                            <span>
                                                {item?.total_units_counts ||
                                                    "N/A"}
                                            </span>
                                        </li>
                                        <li>
                                            <span>Annual Rent</span>
                                            <span>
                                                {item?.annual_rent ? `AED ${item.annual_rent}` : "N/A"}
                                            </span>
                                        </li>
                                        <li>
                                            <span>No. of Cheques</span>
                                            <span>
                                                {item?.no_of_cheques || "N/A"}
                                            </span>
                                        </li>
                                        <li>
                                            <span>Completed Payments</span>
                                            <span>
                                                {item?.cheque_payments
                                                    ? item.cheque_payments.filter(payment => payment.payment_status === "done").length
                                                    : "N/A"}
                                            </span>
                                        </li>
                                        <li>
                                            <span>City</span>
                                            <span>
                                                {item?.location?.city || "N/A"}
                                            </span>
                                        </li>
                                        {/* <li>
                                            <span>Handover</span>
                                            <span>
                                                {dateToYMD(
                                                    item.newParam?.handoverTime
                                                ) || "N/A"}
                                            </span>
                                        </li> */}
                                        {/* <li>
                                            <span>Bedrooms</span>
                                            <span>
                                                {`${bedroomString(item.newParam?.bedroomMin)} - ${bedroomString(item.newParam?.bedroomMax)}`}
                                            </span>
                                        </li> */}

                                        <li>
                                            <span>Agent</span>
                                            <span>
                                                {item?.agent?.name || "N/A"}
                                            </span>
                                        </li>
                                        <li>
                                            <span>Watchman</span>
                                            <span>
                                                {item?.watchman?.name || "N/A"}
                                            </span>
                                        </li>
                                        <li>
                                            <span>Watchman Contact</span>
                                            <span>
                                                {item?.watchman?.contact_no || "N/A"}
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                    {isFetchingNextPage && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                padding: "1rem",
                                backgroundColor: "transparent",
                            }}
                        >
                            <Spinner />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default NewBuilding;
