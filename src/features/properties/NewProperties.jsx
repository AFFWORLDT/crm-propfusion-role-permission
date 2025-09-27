import styles from "../../styles/Listings.module.css";
import React, { useEffect } from "react";
import Spinner from "../../ui/Spinner";
import toast from "react-hot-toast";
import {
    bedroomString,
    formatNum,
    getDaysFromCurrentDate,
} from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import NewPropertyItemTag from "./NewPropertyItemTag";
import { useSelectedProperties } from "../../context/SelectedPropertiesContext";
import useAllDetails from "../all-details/useAllDetails";
import PropertyQualityScore from "./PropertyQualityScore";

const contextMenuStyles = {
    position: "fixed",
    backgroundColor: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "8px 0",
    zIndex: 1000,
    minWidth: "200px",
};

const menuItemStyles = {
    padding: "8px 16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#333",
    ":hover": {
        backgroundColor: "#f5f5f5",
    },
};
function NewProperties({
    listingType,
    isLoading,
    data,
    error,
    showCheckboxes,
    isFetchingNextPage,
}) {
    const navigate = useNavigate();
    const { selectedIds, toggleSelection } = useSelectedProperties();
    const { data: allData } = useAllDetails();
    const [contextMenu, setContextMenu] = React.useState(null);

    useEffect(() => {
        if (error) toast.error(error.message);
    }, [error]);

    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const getPropertyUrl = (id,type) => {
        return `/for-${type.toLowerCase()}/new-list/${id}`;
    };

    const handleNavigate = (id,type) => {
        navigate(getPropertyUrl(id,type));
    };

    const handleContextMenu = (e, id) => {
        e.preventDefault();
        setContextMenu({
            x: e.pageX,
            y: e.pageY,
            id: id,
        });
    };

    const handleOpenInNewTab = (id) => {
        window.open(getPropertyUrl(id,listingType), "_blank");
        setContextMenu(null);
    };

    // const handleItemClick = (e, id) => {
    //     if (!e.target.matches('input[type="checkbox"]')) {
    //         handleNavigate(id);
    //     }
    // };

    return (
        <>
            {isLoading ? (
                <Spinner type="fullPage" />
            ) : data.length === 0 ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "3rem",
                        backgroundColor: "#fff",
                        borderRadius: "12px",
                        boxShadow:
                            "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
                        width: "100%",
                        minHeight: "400px",
                        textAlign: "center",
                        border: "2px dashed #e5e7eb",
                        marginTop: "2rem",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#f3f4f6",
                            padding: "2rem",
                            borderRadius: "50%",
                            marginBottom: "2rem",
                        }}
                    >
                        <svg
                            width="100"
                            height="100"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#6b7280"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                            <path d="M16 2v6h6" />
                            <path d="m3 16 5-5c.928-.893 2.072-.893 3 0l3 3" />
                            <path d="m14 14 1-1c.928-.893 2.072-.893 3 0l3 3" />
                        </svg>
                    </div>
                    <h2
                        style={{
                            color: "#374151",
                            fontSize: "1.875rem",
                            fontWeight: "700",
                            letterSpacing: "-0.025em",
                            marginBottom: "1rem",
                        }}
                    >
                        No Properties Found
                    </h2>
                    <p
                        style={{
                            color: "#6b7280",
                            fontSize: "1.4rem",
                            maxWidth: "500px",
                            lineHeight: "1.625",
                            marginBottom: "1.5rem",
                        }}
                    >
                        Try broadening your search by adjusting price range or
                        location
                    </p>
                    <div
                        style={{
                            padding: "1rem 2rem",
                            backgroundColor: "#f9fafb",
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                        }}
                    >
                        <p
                            style={{
                                color: "#4b5563",
                                fontSize: "1.4rem",
                            }}
                        >
                            💡 Tip : Try broadening your search by adjusting
                            price range or location
                        </p>
                    </div>
                </div>
            ) : (
                <div
                    className={styles.listings}
                    style={{ height: data.length > 3 ? "100vh" : "auto" }}
                >
                    {data.map((item) => (
                        <div
                            className={styles.listingItem}
                            key={item.id}
                            // onClick={(e) => handleItemClick(e, item.id)}
                            onContextMenu={(e) => handleContextMenu(e, item.id)}
                            style={{ cursor: "pointer" }}
                        >
                            {" "}
                            <div
                                className="imgContainer"
                                onClick={() => handleNavigate(item.id,item?.listingType)}
                                style={{ position: "relative" }}
                            >
                                {/* Conditionally rendering text based on completionStatus */}
                                {(item.completionStatus ===
                                    "completed_primary" ||
                                    item.completionStatus === "completed") && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: "1px",
                                            left: "1px",
                                            padding: "5px 8px",
                                            backgroundColor: "#4CAF50", // Green for Completed
                                            color: "white",
                                            fontWeight: "bold",
                                            borderRadius: "12px",
                                            fontSize: "8px",
                                            boxShadow:
                                                "0 4px 8px rgba(0, 0, 0, 0.2)",
                                            textTransform: "uppercase",
                                            zIndex: 1,
                                        }}
                                    >
                                        Completed
                                    </span>
                                )}
                                {(item.completionStatus === "off_plan" ||
                                    item.completionStatus ===
                                        "off_plan_primary") && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: "1px",
                                            left: "1px",
                                            padding: "5px 8px",
                                            backgroundColor: "#FF5722", // Red for Off Primary
                                            color: "white",
                                            fontWeight: "bold",
                                            borderRadius: "12px",
                                            fontSize: "8px",
                                            boxShadow:
                                                "0 4px 8px rgba(0, 0, 0, 0.2)",
                                            textTransform: "uppercase",
                                            zIndex: 1,
                                        }}
                                    >
                                        Off Plan
                                    </span>
                                )}

                                <img src={item.photos?.[0]} alt={item.title} />
                            </div>
                            <div className={styles.listingContent}>
                                <div className={styles.listingTop}>
                                    <h2>{item?.title}</h2>
                                    <NewPropertyItemTag propertyData={item} />
                                    <PropertyQualityScore qualityScoreDetails={item.quality_score_details} propertyTitle={item.title} />
                                    <div>
                                        {item.propertyFinder && (
                                            <>
                                                <img
                                                    src="/icons/property-finder.png"
                                                    className={`${
                                                        item?.propertyFinder ===
                                                        "REQ_ENABLE"
                                                            ? "image-adjuster"
                                                            : ""
                                                    }`}
                                                    alt="Property Finder Icon"
                                                />
                                            </>
                                        )}
                                        {item?.bayut && (
                                            <>
                                                <img
                                                    src="/icons/bayut.png"
                                                    className={`${
                                                        item?.bayut ===
                                                        "REQ_ENABLE"
                                                            ? "image-adjuster"
                                                            : ""
                                                    }`}
                                                />
                                            </>
                                        )}
                                        {item?.dubizzle && (
                                            <>
                                                <img
                                                    src="/icons/dubizzle.png"
                                                    className={`${
                                                        item?.dubizzle ===
                                                        "REQ_ENABLE"
                                                            ? "image-adjuster"
                                                            : ""
                                                    }`}
                                                />
                                            </>
                                        )}
                                        {item?.propfusionPortal && (
                                            <>
                                                <img
                                                    src="/icons/PROPFUSION_LOGO.png"
                                                    className={`${
                                                        item?.propfusionPortal ===
                                                        "REQ_ENABLE"
                                                            ? "image-adjuster"
                                                            : ""
                                                    }`}
                                                />
                                            </>
                                        )}
                                        {item?.customPortal && (
                                            <>
                                                <img
                                                    src="/icons/customePortal.png"
                                                    className={`${
                                                        item?.customPortal ===
                                                        "REQ_ENABLE"
                                                            ? "image-adjuster"
                                                            : ""
                                                    }`}
                                                />
                                            </>
                                        )}
                                        {item?.ownPortal && (
                                            <>
                                                <img
                                                    src={
                                                        allData
                                                            ?.company_settings
                                                            ?.company_logo_url
                                                    }
                                                    className={`${
                                                        item?.ownPortal ===
                                                        "REQ_ENABLE"
                                                            ? "image-adjuster"
                                                            : ""
                                                    }`}
                                                />
                                            </>
                                        )}
                                        {item?.propsearch && (
                                            <>
                                                <img
                                                    src={
                                                        "/icons/propsearch.png"
                                                    }
                                                    className={`${
                                                        item?.propsearch ===
                                                        "REQ_ENABLE"
                                                            ? "image-adjuster"
                                                            : ""
                                                    }`}
                                                />
                                            </>
                                        )}

                                        <span>
                                            {showCheckboxes && (
                                                <input
                                                    type="checkbox"
                                                    className={
                                                        styles.inputCheckbox
                                                    }
                                                    checked={selectedIds.includes(
                                                        item?.id
                                                    )}
                                                    onChange={() =>
                                                        toggleSelection(
                                                            item?.id
                                                        )
                                                    }
                                                />
                                            )}
                                        </span>
                                        <span>
                                            {`${getDaysFromCurrentDate(item.createTime)} days ago`}
                                        </span>
                                    </div>
                                </div>
                                <span className={styles.listingType}>
                                    {item.property_type}
                                </span>
                                <p
                                    className={styles.price}
                                    onClick={() => handleNavigate(item.id)}
                                >
                                    <span>{formatNum(item.price)}</span>
                                    {item?.listingType === "RENT" ? (
                                        <span>
                                            AED {item?.priceType ? `/ ${item.priceType}` : ""}
                                        </span>
                                    ) : (
                                        <span>AED</span>
                                    )}
                                </p>
                                <ul onClick={() => handleNavigate(item.id)}>
                                    <li>
                                        <span>Location</span>
                                        <span>
                                            {[
                                                item.location?.property_name,
                                                item.location?.sub_community,
                                                item.location?.community,
                                                item.location?.city,
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
                                        <span>Area</span>
                                        <span>{item.area?.name || "N/A"}</span>
                                    </li>
                                    <li>
                                        <span>Developer</span>
                                        <span>
                                            {item.developer?.name || "N/A"}
                                        </span>
                                    </li>
                                    <li>
                                        <span>Size</span>
                                        <span>{item.size || "N/A"} sq.ft</span>
                                    </li>
                                    <li className={styles.columnSpanTwo}>
                                        <span>Total Floors</span>
                                        <span>
                                            {item?.totalFloor ||
                                                item?.totalFloor ||
                                                "N/A"}
                                        </span>
                                    </li>
                                    <li className={styles.columnSpanTwo}>
                                        <span>Floor Level</span>
                                        <span>{item?.floor || "N/A"}</span>
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
                                            {item?.washRoom ||
                                                item?.bathrooms ||
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
                    {isFetchingNextPage && <Spinner />}
                </div>
            )}

            {contextMenu && (
                <div
                    style={{
                        ...contextMenuStyles,
                        left: contextMenu.x,
                        top: contextMenu.y,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        style={menuItemStyles}
                        onClick={() => handleOpenInNewTab(contextMenu.id)}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Open in new tab
                    </div>
                </div>
            )}
        </>
    );
}

export default NewProperties;
